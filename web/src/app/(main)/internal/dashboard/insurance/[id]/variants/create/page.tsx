'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, DollarSign, Save } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

interface PolicyVariantForm {
  displayName: string
  excess: string
  copay: string
  payoutLimit: string
  currency: string
}

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
]

export default function CreatePolicyVariantPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)

  const planId = params.id as string

  const [formData, setFormData] = useState<PolicyVariantForm>({
    displayName: '',
    excess: '',
    copay: '',
    payoutLimit: '',
    currency: 'USD',
  })

  const [errors, setErrors] = useState<Partial<PolicyVariantForm>>({})

  const handleBack = () => {
    router.push(`/internal/dashboard/insurance/${planId}`)
  }

  const validateForm = () => {
    const newErrors: Partial<PolicyVariantForm> = {}

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    if (!formData.excess.trim()) {
      newErrors.excess = 'Excess amount is required'
    } else if (isNaN(Number(formData.excess)) || Number(formData.excess) < 0) {
      newErrors.excess = 'Excess must be a valid positive number'
    }

    if (!formData.copay.trim()) {
      newErrors.copay = 'Copay percentage is required'
    } else if (
      isNaN(Number(formData.copay)) ||
      Number(formData.copay) < 0 ||
      Number(formData.copay) > 100
    ) {
      newErrors.copay = 'Copay must be a valid percentage between 0 and 100'
    }

    if (!formData.payoutLimit.trim()) {
      newErrors.payoutLimit = 'Payout limit is required'
    } else if (isNaN(Number(formData.payoutLimit)) || Number(formData.payoutLimit) < 0) {
      newErrors.payoutLimit = 'Payout limit must be a valid positive number'
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // TODO: Replace with actual API call
      const payload = {
        policyId: planId,
        displayName: formData.displayName,
        excess: Number(formData.excess),
        copay: Number(formData.copay),
        limit: Number(formData.payoutLimit),
        currency: formData.currency,
      }

      console.log('Creating policy variant:', payload)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Policy variant created successfully!')

      router.push(`/internal/dashboard/insurance/${planId}`)
    } catch {
      console.error('Failed to create policy variant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof PolicyVariantForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <div>
            <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plan Details
            </Button>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-fredoka text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3 text-gray-900 dark:text-white">
              <DollarSign className="h-8 w-8 md:h-10 md:w-10" />
              Create New Policy Variant
            </h1>
            <p className="font-latto text-muted-foreground text-base md:text-lg">
              Add a new coverage option to this insurance plan
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="font-fredoka text-2xl font-bold text-gray-900 dark:text-white">
                  Policy Variant Details
                </CardTitle>
                <CardDescription className="font-latto text-base text-muted-foreground">
                  Fill in the details for the new policy variant
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Display Name */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="displayName"
                      className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Display Name *
                    </Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="e.g., Premium Coverage, Basic Plan"
                      className={`font-latto ${errors.displayName ? 'border-red-500' : ''}`}
                    />
                    {errors.displayName && (
                      <p className="font-latto text-sm text-red-500">{errors.displayName}</p>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="currency"
                      className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Currency *
                    </Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger
                        className={`font-latto ${errors.currency ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                            className="font-latto"
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="font-latto text-sm text-red-500">{errors.currency}</p>
                    )}
                  </div>

                  {/* Excess */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="excess"
                      className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Excess Amount *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="excess"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.excess}
                        onChange={(e) => handleInputChange('excess', e.target.value)}
                        placeholder="0.00"
                        className={`font-latto pl-10 ${errors.excess ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.excess && (
                      <p className="font-latto text-sm text-red-500">{errors.excess}</p>
                    )}
                    <p className="font-latto text-sm text-muted-foreground">
                      The amount the policyholder pays before insurance coverage begins
                    </p>
                  </div>

                  {/* Copay */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="copay"
                      className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Copay Percentage *
                    </Label>
                    <div className="relative">
                      <Input
                        id="copay"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.copay}
                        onChange={(e) => handleInputChange('copay', e.target.value)}
                        placeholder="20.0"
                        className={`font-latto ${errors.copay ? 'border-red-500' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-latto">
                        %
                      </span>
                    </div>
                    {errors.copay && (
                      <p className="font-latto text-sm text-red-500">{errors.copay}</p>
                    )}
                    <p className="font-latto text-sm text-muted-foreground">
                      The percentage of costs the policyholder pays after meeting the excess
                    </p>
                  </div>

                  {/* Payout Limit */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="payoutLimit"
                      className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Payout Limit *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="payoutLimit"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.payoutLimit}
                        onChange={(e) => handleInputChange('payoutLimit', e.target.value)}
                        placeholder="10000.00"
                        className={`font-latto pl-10 ${errors.payoutLimit ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.payoutLimit && (
                      <p className="font-latto text-sm text-red-500">{errors.payoutLimit}</p>
                    )}
                    <p className="font-latto text-sm text-muted-foreground">
                      The maximum amount the insurance will pay out per policy period
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 font-latto"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Creating...' : 'Create Variant'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="font-latto"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, DollarSign, Plus, Shield } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock data - replace with actual API call
const mockPlanDetails = {
  id: '1',
  policyNumber: 'POL-12345678',
  displayName: 'Essential Pet Care',
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
  variants: [
    {
      id: '1',
      displayName: 'Basic Coverage',
      excess: 100.0,
      copay: 20.0,
      limit: 5000.0,
      currency: 'USD',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      displayName: 'Standard Coverage',
      excess: 200.0,
      copay: 15.0,
      limit: 10000.0,
      currency: 'USD',
      createdAt: '2024-01-16T11:20:00Z',
    },
    {
      id: '3',
      displayName: 'Premium Coverage',
      excess: 300.0,
      copay: 10.0,
      limit: 20000.0,
      currency: 'USD',
      createdAt: '2024-01-17T09:15:00Z',
    },
  ],
}

export default function InsurancePlanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [planDetails, setPlanDetails] = useState(mockPlanDetails)
  const [loading, setLoading] = useState(false)

  const planId = params.id as string

  // TODO: Replace with actual API call
  useEffect(() => {
    // fetchPlanDetails(planId)
  }, [planId])

  const handleBack = () => {
    router.push('/internal/dashboard/insurance')
  }

  const handleCreateVariant = () => {
    router.push(`/internal/dashboard/insurance/${planId}/variants/create`)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-fredoka text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3 text-gray-900 dark:text-white">
            <Shield className="h-8 w-8 md:h-10 md:w-10" />
            {planDetails.displayName}
          </h1>
          <p className="font-latto text-muted-foreground text-base md:text-lg">
            Policy Number: {planDetails.policyNumber}
          </p>
        </div>
        <Button onClick={handleCreateVariant} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Variant
        </Button>
      </div>

      {/* Plan Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <Badge
              variant={planDetails.status === 'active' ? 'default' : 'secondary'}
              className={`font-latto ${
                planDetails.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : ''
              }`}
            >
              {planDetails.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Variants
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-fredoka text-3xl font-bold text-gray-900 dark:text-white">
              {planDetails.variants.length}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">Coverage options</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Created
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-latto text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(planDetails.createdAt)}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">Plan creation date</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Updated
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-latto text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(planDetails.updatedAt)}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">Last modification</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Variants */}
      <Card className="p-6">
        <CardHeader className="pb-6">
          <CardTitle className="font-fredoka text-2xl font-bold text-gray-900 dark:text-white">
            Plan Variants
          </CardTitle>
          <CardDescription className="font-latto text-base text-muted-foreground">
            Different coverage options available for this insurance plan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planDetails.variants.map((variant) => (
              <Card
                key={variant.id}
                className="border-2 hover:border-primary/50 transition-colors p-6"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="font-fredoka text-xl font-bold text-gray-900 dark:text-white">
                    {variant.displayName}
                  </CardTitle>
                  <CardDescription className="font-latto text-sm text-muted-foreground">
                    Created on {formatDate(variant.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="font-latto text-sm text-muted-foreground">Excess:</span>
                    <span className="font-latto font-medium text-gray-900 dark:text-white">
                      {formatCurrency(variant.excess, variant.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-latto text-sm text-muted-foreground">Copay:</span>
                    <span className="font-latto font-medium text-gray-900 dark:text-white">
                      {variant.copay}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-latto text-sm text-muted-foreground">Payout Limit:</span>
                    <span className="font-latto font-medium text-gray-900 dark:text-white">
                      {formatCurrency(variant.limit, variant.currency)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <Badge variant="outline" className="w-full justify-center font-latto">
                      {variant.currency}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Variant Card */}
            <Card
              className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors p-6"
              onClick={handleCreateVariant}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] text-center pt-0">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-fredoka text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Add New Variant
                </h3>
                <p className="font-latto text-sm text-muted-foreground">
                  Create a new coverage option for this plan
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

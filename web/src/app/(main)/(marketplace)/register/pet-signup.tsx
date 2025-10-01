'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPet, CreatePetResponse } from '@/lib/api/pets'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const petTypes = [
  { id: 'dog', name: 'Dog', icon: '🐕' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'small-animal', name: 'Small Animal', icon: '🐹' },
  { id: 'bird', name: 'Bird', icon: '🐦' },
  { id: 'fish', name: 'Fish', icon: '🐠' },
  { id: 'reptile', name: 'Reptile', icon: '🦎' },
]

// Zod schema for pet form validation
const petSignupSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  type: z.string().min(1, 'Please select your pet type'),
  age: z
    .string()
    .min(1, 'Pet age is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Please enter a valid age'),
})

type PetFormData = z.infer<typeof petSignupSchema>

interface PetSignupProps {
  onSubmit: (data: CreatePetResponse) => void
  onBack: () => void
  initialData?: PetFormData
}

export default function PetSignup({ onSubmit, onBack, initialData }: PetSignupProps) {
  const [petForm, setPetForm] = useState<PetFormData>(
    initialData || {
      name: '',
      type: '',
      age: '',
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // TanStack Query mutation for pet creation
  const createPetMutation = useMutation({
    mutationFn: createPet,
    onSuccess: (data) => {
      toast.success('Pet registered successfully!', {
        description: `${data.data.pet_name} has been added to your account`,
      })
      onSubmit(data)
    },
    onError: (error: Error) => {
      toast.error('Pet registration failed', {
        description: error.message,
      })
    },
  })

  const validateForm = () => {
    try {
      petSignupSchema.parse(petForm)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleFormChange = (field: keyof PetFormData, value: string) => {
    setPetForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Call the pet creation API
      createPetMutation.mutate({
        pet_name: petForm.name,
        pet_type: petForm.type,
        age: Number(petForm.age),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-fredoka">
          Tell us about your pet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          We'll send you exclusive offers and expert advice, tailored to their needs.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="petName" className="text-gray-700 dark:text-gray-300">
            My pet's name is:
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="petName"
              type="text"
              placeholder="Pet name *"
              value={petForm.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className={`pl-10 h-12 bg-white dark:border-white text-gray-900 dark:text-gray-900 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you have more pets you can add them later.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300">
            My Pet <span className="font-semibold">is a:</span>
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {petTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleFormChange('type', type.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-full aspect-square border-2 transition-all ${
                  petForm.type === type.id
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {petForm.type === type.id && (
                  <CheckCircle2 className="absolute top-1 right-1 w-5 h-5 text-primary" />
                )}
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                  {type.name}
                </span>
              </button>
            ))}
          </div>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300">
            How old is <span className="font-semibold">My Pet:</span>
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Age in years"
              value={petForm.age}
              onChange={(e) => handleFormChange('age', e.target.value)}
              className={`h-12 bg-white dark:border-white text-gray-900 dark:text-gray-900 ${
                errors.age ? 'border-red-500' : ''
              }`}
              min="0"
              max="50"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1 h-12">
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPetMutation.isPending}
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {createPetMutation.isPending ? 'Registering Pet...' : 'Complete Registration'}
          </Button>
        </div>
      </div>
    </div>
  )
}

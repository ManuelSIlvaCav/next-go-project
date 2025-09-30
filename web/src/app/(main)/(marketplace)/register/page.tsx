'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CreatePetResponse } from '@/lib/api/pets'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { PetSignup, UserSignup } from './components'

interface UserFormData {
  email: string
  password: string
  confirmPassword: string
}

interface PetFormData {
  name: string
  type: string
  age: string
}

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null)
  const [petFormData] = useState<PetFormData | null>(null)

  const handleUserNext = (userData: UserFormData) => {
    setUserFormData(userData)
    setCurrentStep(2)
  }

  const handlePetSubmit = (petData: CreatePetResponse) => {
    console.log('Registration complete:', { user: userFormData, pet: petData })
    // Handle form submission here
    alert('Registration successful!')
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= 1
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                About you
              </span>
            </div>

            {/* Divider */}
            <div
              className={`w-12 h-0.5 mx-4 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= 2
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                About your pet
              </span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8">
            {currentStep === 1 ? (
              <UserSignup onNext={handleUserNext} initialData={userFormData || undefined} />
            ) : (
              <PetSignup
                onSubmit={handlePetSubmit}
                onBack={handleBack}
                initialData={petFormData || undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

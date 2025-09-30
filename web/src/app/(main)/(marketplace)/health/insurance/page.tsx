'use client'

import { useState } from 'react'
import { Checkout } from './checkout'
import { InsuranceStepper } from './isurance-stepper'
import { PetDetails, PetDetailsForm } from './pet-details-form'
import { PlanSelection, Quote } from './quote'
import { Review } from './review'

// Step 3: Review (placeholder)
interface ReviewData {
  placeholder?: string // To be implemented
}

// Step 4: Checkout (placeholder)
interface CheckoutData {
  placeholder?: string // To be implemented
}

interface FormData {
  petDetails: PetDetails
  planSelection: PlanSelection
  review: ReviewData
  checkout: CheckoutData
}

const steps = [
  { title: 'Pet Details', description: 'Tell us about your pet' },
  { title: 'Quote', description: 'Choose your plan' },
  { title: 'Review', description: 'Review your selection' },
  { title: 'Checkout', description: 'Complete your purchase' },
]

export default function InsurancePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    petDetails: {
      name: '',
      type: '',
      age: '',
      isInsured: false,
    },
    planSelection: {
      selectedPlan: '',
      annualLimit: '',
    },
    review: {},
    checkout: {},
  })

  const handleStepChange = (newStep: number) => {
    if (newStep >= 0 && newStep < steps.length) {
      setCurrentStep(newStep)
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.petDetails.name && formData.petDetails.type && formData.petDetails.age)
      case 1:
        return !!formData.planSelection.selectedPlan
      case 2:
        return true
      case 3:
        return true
      default:
        return false
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PetDetailsForm
            data={formData.petDetails}
            onChange={(data) => setFormData({ ...formData, petDetails: data })}
          />
        )
      case 1:
        return (
          <Quote
            data={formData.planSelection}
            onChange={(data) => setFormData({ ...formData, planSelection: data })}
            petName={formData.petDetails.name}
            petType={formData.petDetails.type}
          />
        )
      case 2:
        return <Review />
      case 3:
        return <Checkout />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-fredoka text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Pet Insurance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
            Protect your furry friend with comprehensive coverage
          </p>
        </div>

        {/* Stepper */}
        <InsuranceStepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          canProceed={canProceed()}
        />

        {/* Step Content */}
        <div className="mb-6 md:mb-8">{renderCurrentStep()}</div>
      </div>
    </div>
  )
}

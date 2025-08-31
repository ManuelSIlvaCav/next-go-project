'use client'

import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/stepper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StepperProps {
  steps: Array<{ title: string; description?: string }>
  currentStep: number
  onStepChange: (step: number) => void
  canProceed: boolean
}

export function InsuranceStepper({ steps, currentStep, onStepChange, canProceed }: StepperProps) {
  return (
    <div className="w-full mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {steps[currentStep]?.title}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
          canProceed={canProceed}
          showNavigation={false}
        />
      </div>

      {/* Custom Navigation Buttons with validation */}
      <div className="flex justify-between items-center mt-8 px-4 md:px-0 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={() => onStepChange(currentStep + 1)}
          disabled={!canProceed || currentStep === steps.length - 1}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
        >
          <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { Plan, PlanCard } from './plan-card'

export interface PlanSelection {
  selectedPlan: 'essential' | 'standard' | 'complete' | ''
  annualLimit: string
}

interface QuoteProps {
  data: PlanSelection
  onChange: (data: PlanSelection) => void
  petName: string
  petType: 'dog' | 'cat' | ''
}

const plans: Plan[] = [
  {
    id: 'essential',
    name: 'Essential Care',
    price: '£30.43',
    period: '/mo',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-500',
    limits: [
      { amount: '£3,000', selected: true },
      { amount: '£5,000', selected: false },
    ],
    includes: [
      { feature: 'Accident & Illness', included: true },
      { feature: 'MRI and CT Scans', included: true, note: 'Up to £1,000' },
      { feature: 'Dental accident', included: true, note: 'Up to £1,000' },
      { feature: 'Dental illness', included: false },
      { feature: 'Behaviour treatment', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard Care',
    price: '£48.62',
    period: '/mo',
    color: 'bg-primary/10 border-primary/20',
    headerColor: 'bg-primary',
    badge: 'Most popular',
    limits: [
      { amount: '£7,000', selected: true },
      { amount: '£10,000', selected: false },
    ],
    includes: [
      { feature: 'Accident & Illness', included: true },
      { feature: 'MRI and CT Scans', included: true, note: 'Up to annual vet fee limit' },
      { feature: 'Dental accident', included: true, note: 'Up to annual vet fee limit' },
      { feature: 'Dental illness', included: true },
      { feature: 'Behaviour treatment', included: false },
    ],
  },
  {
    id: 'complete',
    name: 'Complete Care',
    price: '£56.72',
    period: '/mo',
    color: 'bg-complement/10 border-complement/20',
    headerColor: 'bg-complement',
    limits: [
      { amount: '£15,000', selected: true },
      { amount: '£20,000', selected: false },
    ],
    includes: [
      { feature: 'Accident & Illness', included: true },
      { feature: 'MRI and CT Scans', included: true, note: 'Up to annual vet fee limit' },
      { feature: 'Dental accident', included: true, note: 'Up to annual vet fee limit' },
      { feature: 'Dental illness', included: true },
      { feature: 'Behaviour treatment', included: true },
    ],
  },
]

export function Quote({ data, onChange, petName, petType }: QuoteProps) {
  const getRandomImage = () => {
    const randomId = petType === 'cat' ? 'cat' : 'dog'
    return `https://picsum.photos/200/300?random=${randomId}`
  }

  return (
    <div className="px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Header with pet image and title */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-6 md:mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={getRandomImage()}
              alt="Pet"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Choose a plan for {petName || 'your pet'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
              All our plans are lifetime cover for accidents and illnesses
            </p>
            <button className="text-primary text-sm underline mt-1">
              - What is lifetime cover? ℹ️
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={data.selectedPlan === plan.id}
              onSelect={() => onChange({ ...data, selectedPlan: plan.id })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

export interface Plan {
  id: 'essential' | 'standard' | 'complete'
  name: string
  price: string
  period: string
  color: string
  headerColor: string
  badge?: string
  limits: Array<{ amount: string; selected: boolean }>
  includes: Array<{
    feature: string
    included: boolean
    note?: string
  }>
}

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200',
        isSelected ? `${plan.color} ring-2 ring-offset-2 ring-primary` : plan.color,
        'dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg',
      )}
      onClick={onSelect}
    >
      {/* Most Popular Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-white px-4 py-1">{plan.badge}</Badge>
        </div>
      )}

      {/* Header */}
      <div className={cn(plan.headerColor, 'text-white p-4 rounded-t-lg')}>
        <h3 className="font-fredoka text-lg md:text-xl font-bold">{plan.name}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
          <span className="text-base md:text-lg">{plan.period}</span>
        </div>
      </div>

      <CardContent className="p-4 md:p-6">
        {/* Annual Vet Fee Limit */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm md:text-base">
            Annual vet fee limit
          </h4>
          <div className="space-y-2">
            {plan.limits.map((limit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    limit.selected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600',
                  )}
                >
                  {limit.selected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{limit.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm md:text-base">
            Includes:
          </h4>
          <div className="space-y-3">
            {plan.includes.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                {item.included ? (
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <span
                    className={cn(
                      'text-sm',
                      item.included
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500',
                    )}
                  >
                    {item.feature}
                  </span>
                  {item.note && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

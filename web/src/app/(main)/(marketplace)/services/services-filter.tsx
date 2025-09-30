'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface ServicesFilterProps {
  selectedDate?: string
  selectedTimeSlot?: string
  selectedTimes: string[]
  priceRange: [number, number]
  maxPrice: number
  selectedServiceTypes: string[]
  onDateChange: (date: string) => void
  onTimeSlotChange: (slot: string) => void
  onTimeChange: (time: string, checked: boolean) => void
  onPriceRangeChange: (range: [number, number]) => void
  onServiceTypeChange: (type: string, checked: boolean) => void
  onClearFilters: () => void
  className?: string
}

const dateOptions = [
  { value: 'today', label: 'Today' },
  { value: 'within-3-days', label: 'Within 3 Days' },
  { value: 'within-week', label: 'Within A Week' },
  { value: 'choose-dates', label: 'Choose Dates' },
]

const timeOfDayOptions = [
  { id: 'morning', label: 'Morning (8:00 - 12:00)' },
  { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
  { id: 'evening', label: 'Evening (17:00 - 21:30)' },
]

const serviceTypeOptions = [
  { id: 'dog-walking', label: 'Dog Walking' },
  { id: 'pet-grooming', label: 'Pet Grooming' },
  { id: 'pet-sitting', label: 'Pet Sitting' },
  { id: 'pet-training', label: 'Pet Training' },
  { id: 'vet-visit', label: 'Vet Visit' },
  { id: 'pet-boarding', label: 'Pet Boarding' },
]

export default function ServicesFilter({
  selectedDate,
  selectedTimeSlot,
  selectedTimes,
  priceRange,
  maxPrice,
  selectedServiceTypes,
  onDateChange,
  onTimeSlotChange,
  onTimeChange,
  onPriceRangeChange,
  onServiceTypeChange,
  onClearFilters,
  className,
}: ServicesFilterProps) {
  const hasActiveFilters =
    selectedDate ||
    selectedTimeSlot !== 'flexible' ||
    selectedTimes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    selectedServiceTypes.length > 0

  return (
    <aside className={cn('hidden lg:block w-80 flex-shrink-0', className)}>
      <div className="sticky top-20 space-y-6">
        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full border-gray-300 dark:border-zinc-600"
          >
            Clear All Filters
          </Button>
        )}

        {/* Date Filter */}
        <Card className="border-gray-200 dark:border-zinc-700 dark:bg-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dateOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedDate === option.value ? 'default' : 'outline'}
                onClick={() => onDateChange(option.value)}
                className="w-full justify-start"
              >
                {option.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Time of Day Filter */}
        <Card className="border-gray-200 dark:border-zinc-700 dark:bg-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Time of day</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeOfDayOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedTimes.includes(option.id)}
                  onCheckedChange={(checked) => onTimeChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm font-normal cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  {option.label}
                </Label>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                or choose a specific time
              </p>
              <Select value={selectedTimeSlot} onValueChange={onTimeSlotChange}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-700">
                  <SelectValue placeholder="I'm Flexible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">I'm Flexible</SelectItem>
                  <SelectItem value="08:00">08:00 AM</SelectItem>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                  <SelectItem value="18:00">06:00 PM</SelectItem>
                  <SelectItem value="19:00">07:00 PM</SelectItem>
                  <SelectItem value="20:00">08:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Price Filter */}
        <Card className="border-gray-200 dark:border-zinc-700 dark:bg-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={maxPrice}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-zinc-300">${priceRange[0]}</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  ${priceRange[1] === maxPrice ? `${maxPrice}+` : priceRange[1]}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 text-center">
                The average hourly rate is ${Math.round(maxPrice / 2)}/hr
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Type Filter */}
        <Card className="border-gray-200 dark:border-zinc-700 dark:bg-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Service Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {serviceTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedServiceTypes.includes(option.id)}
                  onCheckedChange={(checked) => onServiceTypeChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={option.id}
                  className="text-sm font-normal cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

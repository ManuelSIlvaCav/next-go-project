'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface MobileFiltersDrawerProps {
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
  onApplyFilters: () => void
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

export default function MobileFiltersDrawer({
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
  onApplyFilters,
}: MobileFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleApply = () => {
    onApplyFilters()
    setIsOpen(false)
  }

  const activeFiltersCount =
    (selectedDate ? 1 : 0) +
    selectedTimes.length +
    (selectedTimeSlot !== 'flexible' ? 1 : 0) +
    selectedServiceTypes.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full lg:hidden border-gray-300 dark:border-zinc-600 relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto dark:bg-zinc-900 dark:border-zinc-700"
      >
        <SheetHeader className="sticky top-0 bg-white dark:bg-zinc-900 z-10 pb-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Date Filter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Date</h3>
            <div className="grid grid-cols-2 gap-3">
              {dateOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedDate === option.value ? 'default' : 'outline'}
                  onClick={() => onDateChange(option.value)}
                  className="w-full justify-center"
                  size="lg"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-zinc-700" />

          {/* Time of Day Filter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
              Time of day
            </h3>
            <div className="space-y-4">
              {timeOfDayOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-${option.id}`}
                    checked={selectedTimes.includes(option.id)}
                    onCheckedChange={(checked) => onTimeChange(option.id, checked as boolean)}
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={`mobile-${option.id}`}
                    className="text-base font-normal cursor-pointer text-gray-700 dark:text-zinc-300"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
              <div className="pt-4">
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">
                  or choose a specific time
                </p>
                <Select value={selectedTimeSlot} onValueChange={onTimeSlotChange}>
                  <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-800">
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
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-zinc-700" />

          {/* Price Filter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Price</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={maxPrice}
                step={5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-gray-900 dark:text-white">${priceRange[0]}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${priceRange[1] === maxPrice ? `${maxPrice}+` : priceRange[1]}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center">
                The average hourly rate is ${Math.round(maxPrice / 2)}/hr
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-zinc-700" />

          {/* Service Type Filter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
              Service Type
            </h3>
            <div className="space-y-4">
              {serviceTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-service-${option.id}`}
                    checked={selectedServiceTypes.includes(option.id)}
                    onCheckedChange={(checked) =>
                      onServiceTypeChange(option.id, checked as boolean)
                    }
                    className="h-5 w-5"
                  />
                  <Label
                    htmlFor={`mobile-service-${option.id}`}
                    className="text-base font-normal cursor-pointer text-gray-700 dark:text-zinc-300"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 p-4 mt-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClearFilters} className="flex-1" size="lg">
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-primary" size="lg">
              Show Taskers
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

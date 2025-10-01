'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import MobileFiltersDrawer from './mobile-filters-drawer'
import { mockServiceProviders } from './mock-data'
import ServicesFilter from './services-filter'
import ServicesListings from './services-listings'

export default function ServicesPage() {
  // Filter states
  const [selectedDate, setSelectedDate] = useState<string>('within-week')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('flexible')
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150])
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [currentSort, setCurrentSort] = useState<string>('recommended')
  const [currentPage, setCurrentPage] = useState(1)

  const t = useTranslations('ServicesPage')

  const maxPrice = 150

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setCurrentPage(1)
  }

  const handleTimeSlotChange = (slot: string) => {
    setSelectedTimeSlot(slot)
    setCurrentPage(1)
  }

  const handleTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedTimes([...selectedTimes, time])
    } else {
      setSelectedTimes(selectedTimes.filter((t) => t !== time))
    }
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  const handleServiceTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedServiceTypes([...selectedServiceTypes, type])
    } else {
      setSelectedServiceTypes(selectedServiceTypes.filter((t) => t !== type))
    }
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedDate('')
    setSelectedTimeSlot('flexible')
    setSelectedTimes([])
    setPriceRange([0, maxPrice])
    setSelectedServiceTypes([])
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectProvider = (providerId: string) => {
    console.log('Selected provider:', providerId)
    // Handle provider selection - navigate to booking page or open modal
  }

  const handleApplyFilters = () => {
    // Trigger any additional actions when filters are applied
    console.log('Filters applied')
  }

  // Filter providers based on selected filters
  const filteredProviders = mockServiceProviders.filter((provider) => {
    // Price filter
    if (provider.hourlyRate < priceRange[0] || provider.hourlyRate > priceRange[1]) {
      return false
    }

    // Service type filter
    if (selectedServiceTypes.length > 0) {
      const hasMatchingService = provider.specialties.some((specialty) =>
        selectedServiceTypes.some((type) =>
          specialty.toLowerCase().includes(type.replace('-', ' ')),
        ),
      )
      if (!hasMatchingService) return false
    }

    return true
  })

  // Sort providers
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (currentSort) {
      case 'price-low':
        return a.hourlyRate - b.hourlyRate
      case 'price-high':
        return b.hourlyRate - a.hourlyRate
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviewCount - a.reviewCount
      case 'recommended':
      default:
        // Recommended: combination of rating and review count
        return b.rating * b.reviewCount - a.rating * a.reviewCount
    }
  })

  // Pagination
  const providersPerPage = 10
  const totalPages = Math.ceil(sortedProviders.length / providersPerPage)
  const paginatedProviders = sortedProviders.slice(
    (currentPage - 1) * providersPerPage,
    currentPage * providersPerPage,
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">
              Find trusted pet care professionals in your area
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Mobile Filters Button */}
        <div className="mb-4 lg:hidden">
          <MobileFiltersDrawer
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            selectedTimes={selectedTimes}
            priceRange={priceRange}
            maxPrice={maxPrice}
            selectedServiceTypes={selectedServiceTypes}
            onDateChange={handleDateChange}
            onTimeSlotChange={handleTimeSlotChange}
            onTimeChange={handleTimeChange}
            onPriceRangeChange={handlePriceRangeChange}
            onServiceTypeChange={handleServiceTypeChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Desktop Layout: Filters + Listings */}
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <ServicesFilter
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            selectedTimes={selectedTimes}
            priceRange={priceRange}
            maxPrice={maxPrice}
            selectedServiceTypes={selectedServiceTypes}
            onDateChange={handleDateChange}
            onTimeSlotChange={handleTimeSlotChange}
            onTimeChange={handleTimeChange}
            onPriceRangeChange={handlePriceRangeChange}
            onServiceTypeChange={handleServiceTypeChange}
            onClearFilters={handleClearFilters}
          />

          {/* Service Listings */}
          <ServicesListings
            providers={paginatedProviders}
            currentSort={currentSort}
            currentPage={currentPage}
            totalPages={totalPages}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onSelectProvider={handleSelectProvider}
          />
        </div>
      </div>
    </div>
  )
}

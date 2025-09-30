'use client'

import { useState } from 'react'
import MobileSidebarNavigation from './MobileSidebarNavigation'
import PetNavigationMenu from '@/components/pet-navigation-menu/pet-navigation-menu'

import ProductsFilter from './ProductListingsComponent/ProductsFilter'
import ProductsListings from './ProductListingsComponent/ProductsListings'

type FilterState = Record<string, string[]>

export default function MarketplaceProductsPage() {
  // Filter states
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({})
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = (sectionId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentSection = prev[sectionId] || []

      if (checked) {
        return {
          ...prev,
          [sectionId]: [...currentSection, optionId],
        }
      } else {
        return {
          ...prev,
          [sectionId]: currentSection.filter((id) => id !== optionId),
        }
      }
    })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
    setPriceRange([0, 100000])
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSortChange = (sort: string) => {
    setCurrentPage(1)
    console.log('Sort changed to:', sort)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 overflow-x-hidden">
      {/* Pet Navigation Menu - Only for products/shop page */}
      <PetNavigationMenu />
      
      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Mobile Sidebar Navigation - Only visible on mobile and only on shop page */}
        <div className="md:hidden mb-4">
          <MobileSidebarNavigation />
        </div>
        {/* Main Content Layout: Filters + Products */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <ProductsFilter
            selectedFilters={selectedFilters}
            priceRange={priceRange}
            maxPrice={100000}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />

          {/* Products Listings */}
          <ProductsListings
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            className="flex-1 min-w-0"
          />
        </div>
      </div>
    </div>
  )
}

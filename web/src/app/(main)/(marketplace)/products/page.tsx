'use client'

import { useState } from 'react'
import MobileSidebarNavigation from './MobileSidebarNavigation'
import PetNavigationMenu from './PetNavigationMenu'
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
      {/* Desktop Navigation Menu */}
      <div>
        <div className="bg-white dark:bg-zinc-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <MobileSidebarNavigation />
              </div>

              {/* Search and other header items can go here */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-zinc-400">
                  Buscar productos...
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <PetNavigationMenu />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
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

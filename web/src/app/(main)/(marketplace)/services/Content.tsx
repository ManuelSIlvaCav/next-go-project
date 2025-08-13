'use client'

import { useState } from 'react'
import PetServiceListings from '../ListingsComponent/pet-service-listing'
import MainSearchComponent from '../MainSearchComponent/MainSearch'

interface SearchData {
  service: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

export default function ServicePageContent() {
  const [searchParams, setSearchParams] = useState<{
    service?: string
    location?: string
    dateFrom?: string
    dateTo?: string
    category?: string
    subcategory?: string
  }>({})

  const [showResults, setShowResults] = useState(false)

  const handleSearch = (data: SearchData) => {
    const params = {
      service: data.service,
      location: 'Santiago, Chile', // Default location since it's not provided by the search component
      dateFrom: data.dateFrom?.toISOString(),
      dateTo: data.dateTo?.toISOString(),
    }

    setSearchParams(params)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Search */}
      <div className="bg-linear-to-r from-primary to-blue-600 py-12 dark:from-purple-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <MainSearchComponent
            onSearch={handleSearch}
            className="bg-white/95 backdrop-blur-xs dark:bg-gray-800/90"
          />
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="py-8">
          <PetServiceListings searchParams={searchParams} />
        </div>
      )}

      {/* Default Content when no search */}
      {!showResults && (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-100">
            Encuentra el cuidador perfecto para tu mascota
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
            Miles de cuidadores verificados listos para cuidar a tu mejor amigo con amor y
            profesionalismo
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-purple-900">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">
                Cuidadores Verificados
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Todos nuestros cuidadores pasan por un proceso de verificación riguroso
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Disponibilidad 24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Encuentra cuidadores disponibles cuando los necesites
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Con Amor y Cariño</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cuidadores que aman a los animales tanto como tú
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

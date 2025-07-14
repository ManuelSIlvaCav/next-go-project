'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import MobileSidebarNavigation from './MobileSidebarNavigation'
import PetNavigationMenu from './PetNavigationMenu'

export default function MarketplaceProductsPage() {
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [currentSubcategory, setCurrentSubcategory] = useState<string>('')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 py-8 md:py-12 dark:from-purple-900 dark:to-blue-900">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
            Productos para tu mascota
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-center mb-4">
            Encuentra todo lo que necesitas para el cuidado de tu mascota
          </p>
        </div>
      </div>

      {/* Header with Navigation */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <MobileSidebarNavigation />
              <h1 className="text-xl font-bold text-primary">PetVet</h1>
            </div>

            {/* Search and other header items can go here */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-zinc-400">Buscar productos...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:block">
        <PetNavigationMenu />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb or current selection */}
        {(currentCategory || currentSubcategory) && (
          <Card className="mb-6 p-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600 dark:text-zinc-400">Navegando en:</span>
              {currentCategory && <Badge variant="secondary">{currentCategory}</Badge>}
              {currentSubcategory && (
                <>
                  <span className="text-gray-400">→</span>
                  <Badge variant="default">{currentSubcategory}</Badge>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">🐕</div>
              <h3 className="text-lg font-semibold mb-2">Productos para Perros</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Alimentos, juguetes y accesorios para tu mejor amigo
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">🐱</div>
              <h3 className="text-lg font-semibold mb-2">Productos para Gatos</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Todo lo que tu gato necesita para estar feliz y saludable
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-lg font-semibold mb-2">Farmacia Veterinaria</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm">
                Medicamentos y suplementos para la salud de tu mascota
              </p>
            </div>
          </Card>
        </div>

        {/* Popular Products Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-6">
            Productos Populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 dark:bg-zinc-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 dark:bg-zinc-600"></div>
                  <div className="h-3 bg-gray-100 rounded mb-3 w-2/3 dark:bg-zinc-700"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-primary/20 rounded w-1/3"></div>
                    <Badge variant="outline" className="text-xs">
                      Popular
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-6">
            Marcas Destacadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Royal Canin', "Hill's", 'Pro Plan', 'Eukanuba', 'Acana', 'Orijen'].map((brand) => (
              <Card
                key={brand}
                className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-12 bg-gray-100 rounded mb-2 dark:bg-zinc-700"></div>
                <p className="text-sm font-medium">{brand}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

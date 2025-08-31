'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import MobileSidebarNavigation from '../MobileSidebarNavigation'
import PetNavigationMenu from '../pet-navigation-menu'

export default function PerrosPage() {
  const dogCategories = [
    { name: 'Alimento Seco', count: 142, href: '/products/perros/secos' },
    { name: 'Alimento Húmedo', count: 87, href: '/products/perros/humedos' },
    { name: 'Snacks y Premios', count: 234, href: '/products/perros/snacks' },
    { name: 'Medicados', count: 56, href: '/products/perros/medicados' },
    { name: 'Cachorros', count: 78, href: '/products/perros/cachorros' },
    { name: 'Senior', count: 45, href: '/products/perros/senior' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <MobileSidebarNavigation />
              <Link href="/products" className="text-xl font-bold text-primary">
                PetVet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <PetNavigationMenu />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/products" className="text-gray-600 hover:text-primary dark:text-zinc-400">
              Productos
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-900 font-medium dark:text-zinc-100">Perros</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dogCategories.map((category) => (
            <Card key={category.name} className="p-6 hover:shadow-lg transition-shadow">
              <Link href={category.href}>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {category.count} productos
                  </Badge>
                  <Button variant="outline" className="w-full">
                    Ver productos
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-6">
            Productos Destacados para Perros
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
      </div>
    </div>
  )
}

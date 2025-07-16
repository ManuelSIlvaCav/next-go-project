'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Grid3X3, LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import ProductCard, { Product } from './ProductCard'

// Sample product data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Acana Classic Prairie Poultry Perro',
    brand: 'ACANA',
    price: 18990,
    originalPrice: 20990,
    rating: 5,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '2',
    name: 'Fit Formula Adulto Raza Pequeña 10Kg',
    brand: 'FIT FORMULA',
    price: 24490,
    originalPrice: 32990,
    rating: 5,
    reviewCount: 87,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '3',
    name: 'Brit Care Adult Small Breed - Lamb',
    brand: 'BRIT CARE',
    price: 20490,
    originalPrice: 20990,
    rating: 5,
    reviewCount: 156,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '4',
    name: 'Brit Care Puppy - Salmon',
    brand: 'BRIT CARE',
    price: 22490,
    originalPrice: 75990,
    rating: 5,
    reviewCount: 203,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '5',
    name: 'Brit Care Senior Hypoallergenic',
    brand: 'BRIT CARE',
    price: 19990,
    rating: 4,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '6',
    name: 'Acana Classic Wild Coast',
    brand: 'ACANA',
    price: 21990,
    originalPrice: 25990,
    rating: 5,
    reviewCount: 167,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '7',
    name: 'Acana Classic Prairie Grasslands',
    brand: 'ACANA',
    price: 23490,
    rating: 4,
    reviewCount: 94,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
  {
    id: '8',
    name: 'Eukanuba Excellent Adult Medium',
    brand: 'EUKANUBA',
    price: 18990,
    rating: 4,
    reviewCount: 76,
    imageUrl: 'https://picsum.photos/200/300',
    category: 'Alimento Seco',
    inStock: true,
    isOnSale: true,
  },
]

interface ProductsListingsProps {
  products?: Product[]
  totalProducts?: number
  currentPage?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string) => void
  onViewChange?: (view: 'grid' | 'list') => void
  className?: string
}

type ViewMode = 'grid-2' | 'grid-3' | 'grid-4' | 'list'
type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'

export default function ProductsListings({
  products = sampleProducts,
  totalProducts = sampleProducts.length,
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  onPageChange,
  onSortChange,
  className,
}: ProductsListingsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  const getGridColumns = () => {
    switch (viewMode) {
      case 'grid-2':
        return 'grid-cols-1 sm:grid-cols-2'
      case 'grid-3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 'grid-4':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 'list':
        return 'grid-cols-1'
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (isLoading) {
    return (
      <div className={cn('flex-1', className)}>
        {/* Loading Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse dark:bg-zinc-700" />
          <div className="flex items-center space-x-4">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse dark:bg-zinc-700" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse dark:bg-zinc-700" />
          </div>
        </div>
        <div className={cn('grid gap-6', getGridColumns())}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 dark:border-zinc-700">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse dark:bg-zinc-700" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse dark:bg-zinc-700" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse dark:bg-zinc-700" />
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse dark:bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex-1 min-w-0', className)}>
      {/* Header with sorting and view options */}
      <div className="mb-4 md:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            Mostrando {products.length} de {totalProducts} productos
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36 sm:w-48 text-xs sm:text-sm">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="name-asc">Nombre A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre Z-A</SelectItem>
              <SelectItem value="price-asc">Precio menor</SelectItem>
              <SelectItem value="price-desc">Precio mayor</SelectItem>
              <SelectItem value="rating-desc">Mejor valorados</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Buttons */}
          <div className="flex items-center border border-gray-200 rounded-lg dark:border-zinc-700 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid-2')}
              className={cn(
                'px-2 md:px-3 py-2 rounded-l-lg rounded-r-none',
                viewMode === 'grid-2' && 'bg-gray-100 dark:bg-zinc-800',
              )}
            >
              <Grid3X3 className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid-3')}
              className={cn(
                'px-2 md:px-3 py-2 rounded-none border-x border-gray-200 dark:border-zinc-700',
                viewMode === 'grid-3' && 'bg-gray-100 dark:bg-zinc-800',
              )}
            >
              <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid-4')}
              className={cn(
                'px-2 md:px-3 py-2 rounded-none hidden sm:flex',
                viewMode === 'grid-4' && 'bg-gray-100 dark:bg-zinc-800',
              )}
            >
              <div className="grid grid-cols-2 gap-0.5 h-3 w-3 md:h-4 md:w-4">
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                'px-2 md:px-3 py-2 rounded-r-lg rounded-l-none',
                viewMode === 'list' && 'bg-gray-100 dark:bg-zinc-800',
              )}
            >
              <List className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={cn('grid gap-4 md:gap-6', getGridColumns())}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className={viewMode === 'list' ? 'flex flex-row' : ''}
            onAddToCart={(id) => console.log('Add to cart:', id)}
            onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const page = i + 1
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => onPageChange?.(page)}
                className="w-10"
              >
                {page}
              </Button>
            )
          })}

          <Button
            variant="outline"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

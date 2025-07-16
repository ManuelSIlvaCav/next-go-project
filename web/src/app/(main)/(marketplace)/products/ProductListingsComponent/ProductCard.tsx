'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Heart, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  category: string
  inStock: boolean
  isOnSale?: boolean
  labels?: string[]
}

interface ProductCardProps {
  product: Product
  className?: string
  onAddToCart?: (productId: string) => void
  onToggleFavorite?: (productId: string) => void
}

export default function ProductCard({
  product,
  className,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    onToggleFavorite?.(product.id)
  }

  const handleAddToCart = () => {
    onAddToCart?.(product.id)
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-primary/20 dark:border-zinc-700',
        className,
      )}
    >
      {/* Sale/Offer Badge */}
      {product.isOnSale && (
        <div className="absolute top-2 left-2 z-15">
          <Badge className="bg-purple-500 text-white font-semibold px-2 py-1 text-xs hover:bg-purple-600">
            Oferta
          </Badge>
        </div>
      )}

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-12 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
        onClick={handleToggleFavorite}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-zinc-400',
          )}
        />
      </Button>

      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={cn(
              'object-contain transition-all duration-300 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-700" />
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="destructive" className="text-xs font-bold">
                -{discountPercentage}%
              </Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          {/* Brand */}
          <div className="text-sm text-gray-600 dark:text-zinc-400 font-medium uppercase tracking-wide">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 dark:text-zinc-100 line-clamp-2 text-sm leading-5 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-zinc-600',
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-zinc-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through dark:text-zinc-500">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-xs text-green-600 font-medium dark:text-green-400">
                Desde ${product.price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <Badge variant="secondary" className="text-xs">
              Agotado
            </Badge>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition-colors dark:bg-yellow-400 dark:hover:bg-yellow-500"
          >
            COMPRAR
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

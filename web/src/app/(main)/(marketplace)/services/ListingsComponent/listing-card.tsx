'use client'

import { Clock, Heart, MapPin, MessageCircle, Shield, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { mockListings } from './pet-service-listing'

interface ListingCardProps {
  listing: (typeof mockListings)[0]
  onContact: (id: number) => void
  onFavorite: (id: number) => void
}

export default function ListingCard({ listing, onContact, onFavorite }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    onFavorite(listing.id)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Image Gallery */}
        <div className="relative md:w-80 h-60 md:h-auto">
          <Image
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            fill
            className="object-cover"
          />

          {/* Image Navigation */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentImageIndex
                      ? 'bg-white dark:bg-blue-500'
                      : 'bg-white/50 dark:bg-gray-700',
                  )}
                />
              ))}
            </div>
          )}

          {/* Premium Badge */}
          {listing.isPremium && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              PREMIUM
            </Badge>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            onClick={handleFavorite}
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300',
              )}
            />
          </Button>

          {/* Online Status */}
          <div className="absolute top-12 right-3">
            <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-xs">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  listing.isOnline ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500',
                )}
              />
              <span
                className={
                  listing.isOnline
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-300'
                }
              >
                {listing.isOnline ? `online ${listing.lastSeen}` : listing.lastSeen}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-2xl md:text-3xl font-semibold text-primary dark:text-primary">
                  {listing.name}
                </h3>
                {listing.verified && <Shield className="w-4 h-4 text-primary dark:text-primary" />}
              </div>
              <h4 className="text-lg text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {listing.title}
              </h4>
            </div>

            {/* Rating and Price Section */}
            <div className="flex flex-col items-end space-y-2">
              {/* Rating */}
              <div className="flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium">
                <span className="text-primary dark:text-primary">{listing.rating}</span>
                <Star className="w-3 h-3 text-primary dark:text-primary fill-current" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-1 mb-3">
            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium">{listing.location}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {listing.neighborhoods.join(', ')}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.services.map((service, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs dark:bg-gray-800 dark:text-gray-100"
              >
                {service}
              </Badge>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.badges.map((badge, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-primary/20 text-primary dark:border-primary/40 dark:text-primary"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {listing.description}
          </p>

          {/* Response Time */}
          <div className="flex items-center space-x-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{listing.responseTime}</span>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Review Count */}
            <div className="text-left">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {listing.reviewCount} reseñas
              </span>
            </div>

            <div className="flex flex-col items-end space-x-4 gap-4">
              {/* Price */}
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-primary">
                  ${listing.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">/{listing.priceUnit}</div>
              </div>
              {/* Contact Actions */}
              <div className="flex space-x-2">
                <Button
                  size="lg"
                  onClick={() => onContact(listing.id)}
                  className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-lg">Contactar</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

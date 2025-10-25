'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Car, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export interface ServiceProvider {
  id: string
  name: string
  profileImage: string
  rating: number
  reviewCount: number
  completedTasks: number
  overallTasks: number
  hourlyRate: number
  description: string
  specialties: string[]
  isElite?: boolean
  hasVehicle?: boolean
  vehicleType?: string
  recentReview?: {
    author: string
    date: string
    text: string
  }
}

interface ServiceCardProps {
  provider: ServiceProvider
  className?: string
  onSelect?: (providerId: string) => void
}

export default function ServiceCard({ provider, className, onSelect }: ServiceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handleSelect = () => {
    onSelect?.(provider.id)
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-primary/20 dark:border-zinc-700 dark:bg-zinc-800',
        className,
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-row gap-4 sm:gap-6">
          {/* Left Column: Image and Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0">
            {/* Provider Image */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-700 ring-4 ring-gray-100 dark:ring-zinc-700">
              <Image
                src={provider.profileImage}
                alt={provider.name}
                fill
                className={cn(
                  'object-cover transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-600" />
              )}
            </div>

            {/* Action Buttons - Stacked below image */}
            <div className="flex flex-col gap-2 w-24 sm:w-48">
              <Button
                onClick={handleSelect}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold font-fredoka text-xs sm:text-sm px-2 sm:px-4"
              >
                Select
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary dark:hover:bg-primary/20 font-latto text-xs sm:text-sm px-2 sm:px-4 "
              >
                View
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white font-fredoka">
                    {provider.name}
                  </h3>
                  {provider.isElite && (
                    <Badge className="bg-purple-500 text-white text-xs px-2 py-0.5 font-latto">
                      ⭐ ELITE
                    </Badge>
                  )}
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white font-latto">
                      {provider.rating.toFixed(1)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-latto">
                      ({provider.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Tasks Completed */}
                <div className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1 font-latto">
                  {provider.completedTasks} {provider.specialties[0]} tasks
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-latto">
                  {provider.overallTasks} tasks overall
                </div>

                {/* Vehicle Info */}
                {provider.hasVehicle && (
                  <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-600 dark:text-zinc-400 font-latto">
                    <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Vehicle: {provider.vehicleType}</span>
                  </div>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white font-fredoka whitespace-nowrap">
                  ${provider.hourlyRate.toFixed(2)}/hr
                </div>
              </div>
            </div>

            {/* Description - visible on mobile, hidden on desktop */}
            <div className="mb-3 sm:hidden">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 font-fredoka">
                How I can help:
              </h4>
              <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-latto">
                {showFullDescription
                  ? provider.description
                  : provider.description.length > 100
                  ? `${provider.description.substring(0, 100)}...`
                  : provider.description}
              </p>
              {provider.description.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm text-primary hover:underline font-medium mt-1 font-latto"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Description - hidden on mobile, visible on desktop */}
            <div className="mb-3 hidden sm:block">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 font-fredoka">
                How I can help:
              </h4>
              <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-latto">
                {showFullDescription
                  ? provider.description
                  : provider.description.length > 100
                  ? `${provider.description.substring(0, 100)}...`
                  : provider.description}
              </p>
              {provider.description.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm text-primary hover:underline font-medium mt-1 font-latto"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Recent Review - hidden on mobile */}
            {provider.recentReview && (
              <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-3 mb-3 hidden sm:block">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 font-fredoka">
                      {provider.recentReview.author[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white font-fredoka">
                        {provider.recentReview.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 font-latto">
                        on {provider.recentReview.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 italic font-latto">
                      "{provider.recentReview.text}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-zinc-400 text-center sm:text-left font-latto hidden sm:block">
              You can chat with your Tasker, adjust task details, or change task time after booking.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

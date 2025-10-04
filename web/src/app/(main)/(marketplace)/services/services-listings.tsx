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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ServiceCard, { ServiceProvider } from './service-card'

interface ServicesListingsProps {
  providers: ServiceProvider[]
  currentSort: string
  currentPage: number
  totalPages: number
  onSortChange: (sort: string) => void
  onPageChange: (page: number) => void
  onSelectProvider: (providerId: string) => void
  className?: string
}

export default function ServicesListings({
  providers,
  currentSort,
  currentPage,
  totalPages,
  onSortChange,
  onPageChange,
  onSelectProvider,
  className,
}: ServicesListingsProps) {
  return (
    <div className={cn('flex-1 min-w-0', className)}>
      {/* Header with Sort and Count */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-fredoka">
            Available Service Providers
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-zinc-400 font-latto">Sorted by:</span>
            <Select value={currentSort} onValueChange={onSortChange}>
              <SelectTrigger className="w-[160px] bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 font-latto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended" className="font-latto">
                  Recommended
                </SelectItem>
                <SelectItem value="price-low" className="font-latto">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high" className="font-latto">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="rating" className="font-latto">
                  Highest Rated
                </SelectItem>
                <SelectItem value="reviews" className="font-latto">
                  Most Reviews
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-zinc-400 font-latto">
          {providers.length} service providers available
        </p>
      </div>

      {/* Active Filter Pills (Mobile) */}
      <div className="flex flex-wrap gap-2 mb-4 px-4 sm:px-0 lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-latto"
        >
          Date: Within A Week
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-latto"
        >
          Time: I'm Flexible
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-latto"
        >
          £10 - £150+
        </Button>
      </div>

      {/* Service Cards List */}
      <div className="space-y-4 px-4 sm:px-0">
        {providers.map((provider) => (
          <ServiceCard key={provider.id} provider={provider} onSelect={onSelectProvider} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 px-4 sm:px-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-gray-300 dark:border-zinc-600 font-latto"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  'min-w-[36px] font-latto',
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border-gray-300 dark:border-zinc-600',
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-gray-300 dark:border-zinc-600 font-latto"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {providers.length === 0 && (
        <div className="text-center py-12 px-4 sm:px-0">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-fredoka">
            No providers found
          </h3>
          <p className="text-gray-600 dark:text-zinc-400 mb-4 font-latto">
            Try adjusting your filters to see more results
          </p>
          <Button variant="outline" className="border-gray-300 dark:border-zinc-600 font-latto">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

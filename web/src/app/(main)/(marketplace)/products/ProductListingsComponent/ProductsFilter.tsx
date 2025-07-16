'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterSection {
  id: string
  title: string
  options: FilterOption[]
  expanded?: boolean
}

interface ProductsFilterProps {
  filters?: FilterSection[]
  selectedFilters: Record<string, string[]>
  priceRange: [number, number]
  maxPrice: number
  onFilterChange: (sectionId: string, optionId: string, checked: boolean) => void
  onPriceRangeChange: (range: [number, number]) => void
  onClearFilters: () => void
  className?: string
}

// Sample filter data based on the image
const defaultFilters: FilterSection[] = [
  {
    id: 'edad',
    title: 'EDAD',
    expanded: true,
    options: [
      { id: 'adulto', label: 'Adulto', count: 201 },
      { id: 'cachorro', label: 'Cachorro', count: 58 },
      { id: 'senior', label: 'Senior', count: 55 },
    ],
  },
  {
    id: 'proteina',
    title: 'PROTEÍNA',
    expanded: true,
    options: [
      { id: 'cerdo', label: 'Cerdo', count: 34 },
      { id: 'conejo', label: 'Conejo', count: 1 },
      { id: 'cordero', label: 'Cordero', count: 16 },
      { id: 'pato', label: 'Pato', count: 13 },
      { id: 'pavo', label: 'Pavo', count: 33 },
      { id: 'pescado', label: 'Pescado', count: 45 },
      { id: 'pollo', label: 'Pollo', count: 192 },
      { id: 'venado', label: 'Venado', count: 3 },
      { id: 'vacuno', label: 'Vacuno', count: 30 },
      { id: 'insecto', label: 'Insecto', count: 5 },
    ],
  },
  {
    id: 'formato',
    title: 'FORMATO',
    expanded: true,
    options: [
      { id: 'saco-pequeno', label: 'Saco pequeño (<5kg)', count: 183 },
      { id: 'saco-mediano', label: 'Saco mediano (5-10 kg)', count: 63 },
      { id: 'saco-grande', label: 'Saco grande (10-20 kg)', count: 78 },
      { id: 'saco-extra-grande', label: 'Saco extra grande (>20kg)', count: 12 },
    ],
  },
  {
    id: 'marca',
    title: 'MARCA',
    expanded: false,
    options: [
      { id: 'acana', label: 'Acana', count: 24 },
      { id: 'brit-care', label: 'Brit Care', count: 45 },
      { id: 'royal-canin', label: 'Royal Canin', count: 89 },
      { id: 'hill-s', label: "Hill's", count: 67 },
      { id: 'eukanuba', label: 'Eukanuba', count: 34 },
    ],
  },
]

function FilterSection({
  section,
  selectedOptions,
  onFilterChange,
}: {
  section: FilterSection
  selectedOptions: string[]
  onFilterChange: (optionId: string, checked: boolean) => void
}) {
  const [isExpanded, setIsExpanded] = useState(section.expanded ?? true)

  return (
    <Card className="border-gray-200 dark:border-zinc-700">
      <CardHeader className="cursor-pointer py-3 px-4" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-zinc-100">
          {section.title}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="space-y-3">
            {section.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${section.id}-${option.id}`}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => onFilterChange(option.id, checked as boolean)}
                />
                <Label
                  htmlFor={`${section.id}-${option.id}`}
                  className="flex-1 text-sm text-gray-700 dark:text-zinc-300 cursor-pointer"
                >
                  {option.label}
                </Label>
                {option.count && (
                  <span className="text-xs text-gray-500 dark:text-zinc-500">({option.count})</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function PriceRangeFilter({
  priceRange,
  maxPrice,
  onPriceRangeChange,
}: {
  priceRange: [number, number]
  maxPrice: number
  onPriceRangeChange: (range: [number, number]) => void
}) {
  const [localRange, setLocalRange] = useState(priceRange)

  const handleMinChange = (value: string) => {
    const min = Math.max(0, Math.min(parseInt(value) || 0, localRange[1]))
    const newRange: [number, number] = [min, localRange[1]]
    setLocalRange(newRange)
    onPriceRangeChange(newRange)
  }

  const handleMaxChange = (value: string) => {
    const max = Math.min(maxPrice, Math.max(parseInt(value) || maxPrice, localRange[0]))
    const newRange: [number, number] = [localRange[0], max]
    setLocalRange(newRange)
    onPriceRangeChange(newRange)
  }

  return (
    <Card className="border-gray-200 dark:border-zinc-700">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
          PRECIO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Mín"
              value={localRange[0]}
              onChange={(e) => handleMinChange(e.target.value)}
              className="text-sm"
            />
            <span className="text-gray-500 dark:text-zinc-500">-</span>
            <Input
              type="number"
              placeholder="Máx"
              value={localRange[1]}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-500">
            ${localRange[0].toLocaleString()} - ${localRange[1].toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterContent({
  filters,
  selectedFilters,
  priceRange,
  maxPrice,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
}: Omit<ProductsFilterProps, 'className'>) {
  const activeFiltersCount = Object.values(selectedFilters).flat().length

  return (
    <div className="space-y-4">
      {/* Header with clear filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Filtros</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary hover:text-primary/80"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([sectionId, options]) =>
              options.map((optionId) => {
                const section = filters?.find((f) => f.id === sectionId)
                const option = section?.options.find((o) => o.id === optionId)
                return option ? (
                  <Badge
                    key={`${sectionId}-${optionId}`}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-secondary/80"
                    onClick={() => onFilterChange(sectionId, optionId, false)}
                  >
                    {option.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null
              }),
            )}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <PriceRangeFilter
        priceRange={priceRange}
        maxPrice={maxPrice}
        onPriceRangeChange={onPriceRangeChange}
      />

      {/* Filter Sections */}
      <div className="space-y-3">
        {filters?.map((section) => (
          <FilterSection
            key={section.id}
            section={section}
            selectedOptions={selectedFilters[section.id] || []}
            onFilterChange={(optionId, checked) => onFilterChange(section.id, optionId, checked)}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProductsFilter({
  filters = defaultFilters,
  selectedFilters,
  priceRange,
  maxPrice,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
  className,
}: ProductsFilterProps) {
  const activeFiltersCount = Object.values(selectedFilters).flat().length

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className={cn('hidden lg:block w-80 flex-shrink-0', className)}>
        <div className="sticky top-4">
          <FilterContent
            filters={filters}
            selectedFilters={selectedFilters}
            priceRange={priceRange}
            maxPrice={maxPrice}
            onFilterChange={onFilterChange}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterContent
                filters={filters}
                selectedFilters={selectedFilters}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onFilterChange={onFilterChange}
                onPriceRangeChange={onPriceRangeChange}
                onClearFilters={onClearFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

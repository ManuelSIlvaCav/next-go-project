'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AddressField from '../address-input/AddressField'

// Define the service types for pet care
const PET_SERVICES = [
  { value: 'taxi-mascotas', label: 'Taxi de Mascotas' },
  { value: 'paseo-perros', label: 'Paseo de Perros' },
  { value: 'cuidado-gatos', label: 'Cuidado de Gatos' },
  { value: 'veterinario', label: 'Veterinario' },
  { value: 'peluqueria', label: 'Peluquería Canina' },
  { value: 'pension', label: 'Pensión de Mascotas' },
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'cuidado-hogar', label: 'Cuidado en el Hogar' },
]

type DateSelectionMode = 'range' | 'multiple'

interface SearchData {
  service: string
  dates: Date[] | DateRange | undefined
  selectionMode: DateSelectionMode
}

interface MainServiceSearchComponentProps {
  onSearch?: (data: SearchData) => void
  defaultService?: string
  defaultSelectionMode?: DateSelectionMode
  className?: string
}

export default function MainServiceSearchComponent({
  onSearch,
  defaultService,
  defaultSelectionMode = 'range',
  className,
}: MainServiceSearchComponentProps) {
  const t = useTranslations('SearchComponent')
  const [service, setService] = useState<string>(defaultService || '')
  const [selectionMode, setSelectionMode] = useState<DateSelectionMode>(defaultSelectionMode)

  // State for range selection
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // State for multiple selection
  const [multipleDates, setMultipleDates] = useState<Date[] | undefined>()

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSearch = () => {
    const searchData: SearchData = {
      service,
      dates: selectionMode === 'range' ? dateRange : multipleDates,
      selectionMode,
    }

    console.log('Searching with data:', searchData)
    onSearch?.(searchData)
  }

  const handleModeChange = (mode: DateSelectionMode) => {
    setSelectionMode(mode)
    // Clear dates when switching modes
    setDateRange(undefined)
    setMultipleDates(undefined)
  }

  const getDateButtonLabel = () => {
    if (selectionMode === 'range' && dateRange) {
      if (dateRange.from) {
        if (dateRange.to) {
          return `${format(dateRange.from, 'dd/MM/yyyy', { locale: es })} - ${format(
            dateRange.to,
            'dd/MM/yyyy',
            { locale: es },
          )}`
        }
        return format(dateRange.from, 'dd/MM/yyyy', { locale: es })
      }
    } else if (selectionMode === 'multiple' && multipleDates && multipleDates.length > 0) {
      if (multipleDates.length === 1) {
        return format(multipleDates[0], 'dd/MM/yyyy', { locale: es })
      }
      return `${multipleDates.length} ${t('datesSelected')}`
    }
    return t('datesPlaceholder')
  }

  const isSearchDisabled = !service

  return (
    <div
      className={cn(
        'w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="font-fredoka text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          {t('title')}
        </h1>
        <p className="font-latto text-base sm:text-lg text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
        {/* Service Selection */}
        <div className="space-y-2 w-[14rem] h-[5rem]">
          <label className="font-latto text-sm font-medium text-gray-700 dark:text-gray-200 block">
            {t('serviceLabel')}
          </label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger
              className="data-[size=default]:h-12 w-full  transition-colors text-[14px]"
              size="default"
            >
              <div className="flex items-center">
                <SelectValue placeholder={t('servicePlaceholder')} className=" font-fredoka" />
              </div>
            </SelectTrigger>
            <SelectContent className="font-latto dark:bg-gray-900 dark:border-gray-700 ">
              {PET_SERVICES.map((serviceItem) => (
                <SelectItem
                  key={serviceItem.value}
                  value={serviceItem.value}
                  className="dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {serviceItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Address Field */}
        <AddressField label={t('addressLabel')} className="w-[14rem] h-[5rem]" />

        {/* Date Selection */}
        <div className="space-y-2 w-[16rem] h-[5rem]">
          <label className="font-latto text-sm font-medium text-gray-700 dark:text-gray-200 block">
            {t('datesLabel')}
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-11 sm:h-12 w-full justify-start text-left font-normal font-latto bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-gray-900 dark:text-gray-100',
                  !(dateRange || multipleDates) && 'text-muted-foreground dark:text-gray-400',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span className="truncate text-sm">{getDateButtonLabel()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 dark:bg-gray-900 dark:border-gray-700"
              align="start"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <Tabs
                  value={selectionMode}
                  onValueChange={(value) => handleModeChange(value as DateSelectionMode)}
                >
                  <TabsList className="grid w-full grid-cols-2 font-latto">
                    <TabsTrigger value="range" className="text-sm">
                      {t('rangeMode')}
                    </TabsTrigger>
                    <TabsTrigger value="multiple" className="text-sm">
                      {t('multipleMode')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {selectionMode === 'range' ? (
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={(date) => date < new Date()}
                  numberOfMonths={2}
                  className="dark:bg-gray-900 dark:text-gray-100"
                />
              ) : (
                <Calendar
                  mode="multiple"
                  selected={multipleDates}
                  onSelect={setMultipleDates}
                  disabled={(date) => date < new Date()}
                  numberOfMonths={2}
                  className="dark:bg-gray-900 dark:text-gray-100"
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="space-y-2 w-[14rem] h-[5rem] content-end pb-1">
          <Button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="h-12 sm:h-12 w-full   text-white disabled:bg-gray-300  dark:disabled:bg-gray-700 font-medium text-sm sm:text-base transition-colors"
            size="lg"
          >
            <SearchIcon className="mr-2 h-4 w-5 flex-shrink-0" />
            {t('searchButton')}
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="font-latto text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {t('infoText')}
        </p>
      </div>
    </div>
  )
}

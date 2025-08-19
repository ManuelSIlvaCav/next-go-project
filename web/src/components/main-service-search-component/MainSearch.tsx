'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AddressField from '../address-input/AddressField'
import LocationInput from './LocationInput'

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

interface SearchData {
  service: string
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

interface MainServiceSearchComponentProps {
  onSearch?: (data: SearchData) => void
  defaultService?: string
  className?: string
}

export default function MainServiceSearchComponent({
  onSearch,
  defaultService,
  className,
}: MainServiceSearchComponentProps) {
  const [service, setService] = useState<string>(defaultService || '')

  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

  const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false)
  const [isToCalendarOpen, setIsToCalendarOpen] = useState(false)

  const handleSearch = () => {
    const searchData: SearchData = {
      service,
      dateFrom,
      dateTo,
    }

    console.log('Searching with data:', searchData)
    onSearch?.(searchData)
  }

  const isSearchDisabled = !service || !location

  return (
    <div
      className={cn(
        'w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Conseguir cuidadores de Mascotas
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">para alojar gatos y perros</p>
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Service Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Estoy buscando
          </label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Seleccionar servicio" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
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
        {/* Location Input */}
        <LocationInput />
        <AddressField className="" />

        {/* From Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Desde</label>
          <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-12 w-full justify-start text-left font-normal bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
                  !dateFrom && 'text-muted-foreground dark:text-gray-400',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: es }) : 'Fecha inicio'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 dark:bg-gray-900 dark:border-gray-700"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(date) => {
                  setDateFrom(date)
                  setIsFromCalendarOpen(false)
                }}
                disabled={(date) => date < new Date()}
                className="dark:bg-gray-900 dark:text-gray-100"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hasta</label>
          <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-12 w-full justify-start text-left font-normal bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
                  !dateTo && 'text-muted-foreground dark:text-gray-400',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: es }) : 'Fecha fin'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 dark:bg-gray-900 dark:border-gray-700"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(date) => {
                  setDateTo(date)
                  setIsToCalendarOpen(false)
                }}
                disabled={(date) => {
                  const today = new Date()
                  const minDate = dateFrom || today
                  return date < minDate
                }}
                className="dark:bg-gray-900 dark:text-gray-100"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-transparent">Buscar</label>
          <Button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="h-12 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:bg-purple-700 dark:hover:bg-purple-800 dark:disabled:bg-gray-700 text-white font-medium text-base"
            size="lg"
          >
            <SearchIcon className="mr-2 h-5 w-5" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Encuentra los mejores cuidadores de mascotas cerca de ti
        </p>
      </div>
    </div>
  )
}

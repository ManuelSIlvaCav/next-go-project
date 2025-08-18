import { Input } from '@/components/ui/input'
import { MapPinIcon } from 'lucide-react'
import { useState } from 'react'

export default function LocationInput() {
  const [location, setLocation] = useState<string>('')

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Cerca de mí en</label>
      <div className="relative">
        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Seleccionar Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>
  )
}

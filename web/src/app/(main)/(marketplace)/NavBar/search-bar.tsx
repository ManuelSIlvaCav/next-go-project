'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

const categories = ['Todos', 'Perros', 'Gatos', 'Farmacia', 'Servicios', 'Ofertas']

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos los productos')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'in category:', selectedCategory)
    }
  }
  return (
    <div className="flex-1  mx-4">
      <div className="flex">
        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-200 text-gray-900 px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 h-10 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Buscar productos para mascotas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 rounded-none border-none h-10 focus:ring-2 focus:ring-orange-500 bg-white"
        />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-orange-400 hover:bg-orange-500 text-gray-900 px-4 rounded-r-md h-10 rounded-l-none"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

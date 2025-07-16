'use client'

import { ColorModeToggle } from '@/components/color-mode-toogle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronDown, MapPin, Menu, Search, ShoppingCartIcon, User } from 'lucide-react'
import { useState } from 'react'
import MainCategories from './MainCategories'

interface AmazonNavbarProps {
  className?: string
}

export default function AmazonNavbar({ className }: AmazonNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos los productos')
  const [postcode, setPostcode] = useState('')
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState('Seleccionar dirección')

  const categories = ['Todos los productos', 'Perros', 'Gatos', 'Farmacia', 'Servicios', 'Ofertas']

  const handleAddressSubmit = () => {
    if (postcode.trim()) {
      setCurrentAddress(`Entregar en ${postcode}`)
      setIsAddressDialogOpen(false)
      setPostcode('')
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'in category:', selectedCategory)
    }
  }

  return (
    <div className={cn(className)}>
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-primary to-blue-600 pt-6 dark:from-purple-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              Pet<span className="text-primary">za</span>
            </div>
          </div>

          {/* Address Selector */}
          <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="hidden md:flex flex-col items-start text-white hover:bg-gray-800 h-auto py-1 px-2"
              >
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs text-gray-300">Entregar en</span>
                </div>
                <span className="text-sm font-medium text-white truncate max-w-32">
                  {currentAddress}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Seleccionar dirección de entrega</DialogTitle>
                <DialogDescription>
                  Ingresa tu código postal para ver productos disponibles en tu área
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode">Código postal</Label>
                  <Input
                    id="postcode"
                    placeholder="Ej: 28001"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddressSubmit}>Aplicar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-4">
            <div className="flex">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-200 text-gray-900 px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 h-10 text-sm"
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

          <ColorModeToggle />

          {/* Account & Lists */}
          <Button
            variant="ghost"
            className="hidden md:flex flex-col items-start text-white hover:bg-gray-800 h-auto py-1 px-2"
          >
            <span className="text-xs text-gray-300">Hola, Inicia sesión</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">Cuenta y listas</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </Button>

          {/* User Icon for Mobile */}
          <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-800">
            <User className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <div>
            <Button
              variant="ghost"
              className="text-white hover:border-white relative flex items-center space-x-1 [&_svg]:size-18"
            >
              <div className="relative">
                <ShoppingCartIcon />
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium">Carrito</span>
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4">
          {/* Categories Navigation */}
          <MainCategories />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import ListingCard from './ListingCard'

// Mock data for pet service providers
export const mockListings = [
  // ... (same as before)
  {
    id: 1,
    name: 'Macarena S.',
    title: 'La vida con pelos es más linda',
    location: 'Las Condes, Santiago, Chile',
    neighborhoods: ['Parques', 'Jardines', 'Barrios Tranquilos', 'Residenciales'],
    price: 10000,
    priceUnit: 'paseo',
    rating: 4.8,
    reviewCount: 127,
    isPremium: true,
    isOnline: true,
    lastSeen: 'hace 3 días',
    avatar: '/api/placeholder/80/80',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
    description:
      'Amo a los animales, a todos, aunque reconozco ser doglover crónicamente exagerada. A mis 44 años y luego de cuidar a miles de personas (Enfermera de UCI) necesito entregar mi cariño y conocimiento a ellos...',
    badges: ['100% de respuesta', 'Responde en el día'],
    services: ['Cuidado de día', 'Paseos', 'Cuidado nocturno'],
    responseTime: 'Responde en menos de 1 hora',
    verified: true,
  },
  {
    id: 2,
    name: 'Paula B.',
    title:
      'Cuido a tu hijo/a perruna como si fuese mío; con mucho amor, responsabilidad en cada espacio y actividad.',
    location: 'Santiago, Chile',
    neighborhoods: ['La que el tutor recomiende o desee'],
    price: 8000,
    priceUnit: 'paseo',
    rating: 4.9,
    reviewCount: 89,
    isPremium: true,
    isOnline: true,
    lastSeen: 'hace 26 minutos',
    avatar: '/api/placeholder/80/80',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    description:
      'Cuido y paseo a tus incondicionales. Amante del cuidado animal, con carisma y buena actitud para que tus peludos tengan la mejor experiencia.',
    badges: ['100% de respuesta', 'Responde en el día'],
    services: ['Paseos', 'Cuidado en casa', 'Visitas'],
    responseTime: 'Responde en menos de 30 minutos',
    verified: true,
  },
  {
    id: 3,
    name: 'Carlos M.',
    title: 'Veterinario especializado en comportamiento animal',
    location: 'Providencia, Santiago, Chile',
    neighborhoods: ['Centro', 'Providencia', 'Las Condes'],
    price: 15000,
    priceUnit: 'consulta',
    rating: 4.7,
    reviewCount: 234,
    isPremium: false,
    isOnline: false,
    lastSeen: 'hace 2 horas',
    avatar: '/api/placeholder/80/80',
    images: ['/api/placeholder/300/200'],
    description:
      'Con más de 10 años de experiencia en medicina veterinaria y especialización en comportamiento animal. Ofrezco servicios completos de salud y bienestar para tus mascotas.',
    badges: ['Veterinario certificado', 'Especialista'],
    services: ['Consultas', 'Emergencias', 'Comportamiento'],
    responseTime: 'Responde en menos de 2 horas',
    verified: true,
  },
]

interface PetServiceListingsProps {
  searchParams?: {
    service?: string
    location?: string
    dateFrom?: string
    dateTo?: string
  }
}

export default function PetServiceListings({ searchParams }: PetServiceListingsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('rating')
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const handleContact = (id: number) => {
    console.log('Contacting provider:', id)
    // Handle contact logic
  }

  const handleFavorite = (id: number) => {
    console.log('Favoriting provider:', id)
    // Handle favorite logic
  }

  const filteredListings = mockListings.filter((listing) => {
    if (priceFilter === 'low') return listing.price < 10000
    if (priceFilter === 'medium') return listing.price >= 10000 && listing.price < 15000
    if (priceFilter === 'high') return listing.price >= 15000
    return true
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      case 'distance':
        return 0 // Would implement distance sorting
      default:
        return 0
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Cuidadores de mascotas en {searchParams?.location || 'Santiago, Chile'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {sortedListings.length} cuidadores disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium dark:text-gray-200">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'distance')}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="rating">Mejor valorados</option>
            <option value="price">Precio</option>
            <option value="distance">Distancia</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium dark:text-gray-200">Precio:</label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Todos</option>
            <option value="low">Hasta $10.000</option>
            <option value="medium">$10.000 - $15.000</option>
            <option value="high">Más de $15.000</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-6">
        {sortedListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onContact={handleContact}
            onFavorite={handleFavorite}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button
          variant="outline"
          size="lg"
          className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          Cargar más resultados
        </Button>
      </div>
    </div>
  )
}

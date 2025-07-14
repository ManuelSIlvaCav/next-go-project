'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface SubCategory {
  id: string
  name: string
  href: string
  count?: number
}

interface Category {
  id: string
  name: string
  href: string
  subcategories: SubCategory[]
}

// Same navigation structure
const MOBILE_NAVIGATION_CATEGORIES: Category[] = [
  {
    id: 'ofertas',
    name: 'OFERTAS',
    href: '/ofertas',
    subcategories: [
      { id: 'ofertas-especiales', name: 'Ofertas Especiales', href: '/ofertas/especiales' },
      { id: 'descuentos', name: 'Descuentos', href: '/ofertas/descuentos' },
      { id: 'packs', name: 'Packs', href: '/ofertas/packs' },
    ],
  },
  {
    id: 'packs',
    name: 'PACKS',
    href: '/packs',
    subcategories: [
      { id: 'pack-cachorros', name: 'Pack Cachorros', href: '/packs/cachorros' },
      { id: 'pack-adultos', name: 'Pack Adultos', href: '/packs/adultos' },
      { id: 'pack-senior', name: 'Pack Senior', href: '/packs/senior' },
    ],
  },
  {
    id: 'perros',
    name: 'Perros',
    href: '/products/perros',
    subcategories: [
      { id: 'alimentos', name: 'Alimentos', href: '/products/perros/alimentos' },
      { id: 'secos', name: 'Secos', href: '/products/perros/secos' },
      { id: 'humedos', name: 'Húmedos', href: '/products/perros/humedos' },
      { id: 'snacks', name: 'Snacks', href: '/products/perros/snacks' },
      { id: 'medicados', name: 'Medicados', href: '/products/perros/medicados' },
      { id: 'light', name: 'Light', href: '/products/perros/light' },
      { id: 'cachorros', name: 'Cachorros', href: '/products/perros/cachorros' },
      { id: 'senior', name: 'Senior', href: '/products/perros/senior' },
      {
        id: 'sustituto-lacteo',
        name: 'Sustituto Lácteo',
        href: '/products/perros/sustituto-lacteo',
      },
    ],
  },
  {
    id: 'gatos',
    name: 'Gatos',
    href: '/products/gatos',
    subcategories: [
      { id: 'alimentos', name: 'Alimentos', href: '/products/gatos/alimentos' },
      { id: 'secos', name: 'Secos', href: '/products/gatos/secos' },
      { id: 'humedos', name: 'Húmedos', href: '/products/gatos/humedos' },
      { id: 'snacks', name: 'Snacks', href: '/products/gatos/snacks' },
      { id: 'medicados', name: 'Medicados', href: '/products/gatos/medicados' },
      { id: 'light', name: 'Light', href: '/products/gatos/light' },
      { id: 'gatitos', name: 'Gatitos', href: '/products/gatos/gatitos' },
      { id: 'senior', name: 'Senior', href: '/products/gatos/senior' },
      { id: 'arena', name: 'Arena Sanitaria', href: '/products/gatos/arena' },
    ],
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    href: '/farmacia',
    subcategories: [
      {
        id: 'pulgas-garrapatas',
        name: 'Pulgas, Garrapatas y Gusanos',
        href: '/farmacia/pulgas-garrapatas',
      },
      { id: 'antibioticos', name: 'Antibióticos, Infecciones', href: '/farmacia/antibioticos' },
      { id: 'articular', name: 'Articular', href: '/farmacia/articular' },
      { id: 'cardiaco', name: 'Cardíaco', href: '/farmacia/cardiaco' },
      { id: 'conductuales', name: 'Conductuales', href: '/farmacia/conductuales' },
      { id: 'dermatologicos', name: 'Dermatológicos', href: '/farmacia/dermatologicos' },
      { id: 'dolor-inflamacion', name: 'Dolor, Inflamación', href: '/farmacia/dolor-inflamacion' },
      { id: 'hepatico', name: 'Hepático', href: '/farmacia/hepatico' },
      { id: 'digestivo', name: 'Digestivo', href: '/farmacia/digestivo' },
      { id: 'oculares', name: 'Oculares / Óticos', href: '/farmacia/oculares' },
      { id: 'renal', name: 'Renal y Urinario', href: '/farmacia/renal' },
      { id: 'suplementos', name: 'Suplementos y Vitaminas', href: '/farmacia/suplementos' },
      { id: 'terapias', name: 'Terapias Naturales', href: '/farmacia/terapias' },
    ],
  },
  {
    id: 'marcas',
    name: 'Marcas',
    href: '/marcas',
    subcategories: [
      { id: 'royal-canin', name: 'Royal Canin', href: '/marcas/royal-canin' },
      { id: 'hills', name: 'Hills', href: '/marcas/hills' },
      { id: 'pro-plan', name: 'Pro Plan', href: '/marcas/pro-plan' },
      { id: 'eukanuba', name: 'Eukanuba', href: '/marcas/eukanuba' },
      { id: 'acana', name: 'Acana', href: '/marcas/acana' },
      { id: 'orijen', name: 'Orijen', href: '/marcas/orijen' },
    ],
  },
  {
    id: 'servicios',
    name: 'Servicios',
    href: '/servicios',
    subcategories: [
      { id: 'veterinaria', name: 'Veterinaria', href: '/servicios/veterinaria' },
      { id: 'grooming', name: 'Grooming', href: '/servicios/grooming' },
      { id: 'entrenamiento', name: 'Entrenamiento', href: '/servicios/entrenamiento' },
      { id: 'guarderia', name: 'Guardería', href: '/servicios/guarderia' },
    ],
  },
]

interface MobileSidebarNavigationProps {
  className?: string
}

export default function MobileSidebarNavigation({ className }: MobileSidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    setExpandedCategory(null)
  }

  return (
    <div className={cn('md:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <SheetHeader className="p-4 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold text-primary">PetVet</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="overflow-y-auto h-full">
            <nav className="p-4">
              <div className="space-y-2">
                {MOBILE_NAVIGATION_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={category.href}
                        onClick={handleLinkClick}
                        className="flex-1 block py-2 text-sm font-medium text-gray-900 hover:text-primary dark:text-zinc-100 dark:hover:text-primary"
                      >
                        {category.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCategoryToggle(category.id)}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            expandedCategory === category.id && 'rotate-90',
                          )}
                        />
                      </Button>
                    </div>

                    {/* Subcategories */}
                    {expandedCategory === category.id && (
                      <div className="ml-4 mt-2 space-y-2 border-l border-gray-200 pl-4 dark:border-zinc-700">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={subcategory.href}
                            onClick={handleLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
                          >
                            {subcategory.name}
                            {subcategory.count && (
                              <span className="ml-2 text-xs text-gray-400">
                                ({subcategory.count})
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

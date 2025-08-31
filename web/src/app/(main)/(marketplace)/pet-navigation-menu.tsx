'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
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

// Navigation structure based on the PetVet example
const NAVIGATION_CATEGORIES: Category[] = [
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

interface PetNavigationMenuProps {
  className?: string
}

// Mobile Navigation Component
function MobileNavigation({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="dark:text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 dark:bg-gray-900 dark:border-gray-700">
          <SheetHeader>
            <SheetTitle className="text-left dark:text-white">Categories</SheetTitle>
            <SheetDescription className="text-left dark:text-gray-400">
              Browse our pet products and services
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full mt-6">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(category.id)}
                    className="w-full justify-between p-3 h-auto dark:text-white dark:hover:bg-gray-800"
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedCategory === category.id && 'rotate-180',
                      )}
                    />
                  </Button>

                  {expandedCategory === category.id && (
                    <div className="pl-4 space-y-1">
                      <Link
                        href={category.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm font-medium dark:text-gray-300">
                          Ver todo en {category.name}
                        </span>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                      </Link>

                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={subcategory.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div>
                            <span className="text-sm dark:text-gray-300">{subcategory.name}</span>
                            {subcategory.count && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subcategory.count} productos
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function PetNavigationMenu({ className }: PetNavigationMenuProps) {
  return (
    <div
      className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700',
        className,
      )}
    >
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between p-4">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">PetMarket</h1>
        <MobileNavigation categories={NAVIGATION_CATEGORIES} />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <NavigationMenu className="z-20 mx-auto" viewport={false}>
          <NavigationMenuList className="space-x-0">
            {NAVIGATION_CATEGORIES.map((category) => (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger
                  className={cn(
                    'h-12 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50',
                    'dark:text-gray-200 dark:hover:text-primary dark:hover:bg-gray-800',
                    'data-[state=open]:text-primary data-[state=open]:bg-gray-50',
                    'dark:data-[state=open]:text-primary dark:data-[state=open]:bg-gray-800',
                  )}
                >
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="md:w-[400px] lg:w-[500px] p-4 dark:bg-gray-800 dark:border-gray-700">
                    <Link
                      href={category.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-gray-700"
                    >
                      <div className="font-fredoka text-sm font-medium leading-none text-primary dark:text-blue-400">
                        Ver todo en {category.name}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground dark:text-gray-400">
                        Explora toda nuestra selección de {category.name.toLowerCase()}
                      </p>
                    </Link>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={subcategory.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-gray-700"
                            >
                              <div className="font-fredoka text-sm font-medium leading-none dark:text-gray-200">
                                {subcategory.name}
                              </div>
                              {subcategory.count && (
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground dark:text-gray-400">
                                  {subcategory.count} productos
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

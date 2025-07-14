'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

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

export default function PetNavigationMenu({ className }: PetNavigationMenuProps) {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div
      className={cn(
        'w-full bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-700',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="space-x-0">
            {NAVIGATION_CATEGORIES.map((category) => (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger
                  className={cn(
                    'h-12 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50',
                    'dark:text-zinc-200 dark:hover:text-primary dark:hover:bg-zinc-800',
                    'data-[state=open]:text-primary data-[state=open]:bg-gray-50',
                    'dark:data-[state=open]:text-primary dark:data-[state=open]:bg-zinc-800',
                  )}
                >
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full md:w-[400px] lg:w-[500px]">
                  <div className="p-4">
                    <div className="grid gap-3">
                      <Link
                        href={category.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none text-primary">
                          Ver todo en {category.name}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explora toda nuestra selección de {category.name.toLowerCase()}
                        </p>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        {category.subcategories.map((subcategory) => (
                          <NavigationMenuLink key={subcategory.id} asChild>
                            <Link
                              href={subcategory.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {subcategory.name}
                              </div>
                              {subcategory.count && (
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {subcategory.count} productos
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
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

// Component for listing subcategories in a grid layout
interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string
  href: string
  children?: React.ReactNode
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'

export { ListItem }

'use client'

import { Scissors, ShoppingBag, Stethoscope } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PET_CATEGORIES = [
  {
    id: 'productos',
    label: 'Productos',
    icon: ShoppingBag,
    description: 'Comida, juguetes y accesorios',
    isActive: true,
    href: '/products',
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: Scissors,
    description: 'Cuidado y entrenamiento',
    isActive: false,
    href: '/services',
  },
  {
    id: 'veterinarias',
    label: 'Veterinarias',
    icon: Stethoscope,
    description: 'Consultas y atención médica',
    isActive: false,
    href: '/veterinarias',
  },
]

interface MainCategoriesProps {
  onCategoryChange?: (category: string, subcategory?: string) => void
  className?: string
}

export default function MainCategories({ onCategoryChange, className }: MainCategoriesProps) {
  const pathname = usePathname()
  const getActiveCategory = () => {
    const match = PET_CATEGORIES.find((cat) => pathname.startsWith(cat.href))
    return match ? match.id : PET_CATEGORIES[0].id
  }
  const [activeCategory, setActiveCategory] = useState<string>(getActiveCategory())

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    onCategoryChange?.(categoryId)
  }

  // Update activeCategory if pathname changes
  // (to sync with navigation)
  useEffect(() => {
    const current = getActiveCategory()
    if (activeCategory !== current) {
      setActiveCategory(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className={cn('w-full max-w-6xl py-4  mx-auto', className)}>
      {/* Main Categories Navigation */}
      <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
        {PET_CATEGORIES.map((category) => {
          const IconComponent = category.icon
          const isActive = activeCategory === category.id

          return (
            <Button
              key={category.id}
              variant="ghost"
              asChild
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200',
                isActive
                  ? 'bg-white text-primary border-white shadow-md hover:bg-white/95 dark:bg-zinc-800 dark:text-primary dark:border-zinc-700 dark:shadow-lg dark:hover:bg-zinc-700'
                  : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 dark:text-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:border-zinc-500',
              )}
            >
              <Link href={category.href}>
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

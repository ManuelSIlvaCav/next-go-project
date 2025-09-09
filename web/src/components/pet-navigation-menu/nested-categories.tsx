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
import { Category } from './types'

interface NestedCategoriesProps {
  categories: Category[]
}

export default function NestedCategories({ categories }: NestedCategoriesProps) {
  return (
    <NavigationMenu className="z-20 mx-auto" viewport={false}>
      <NavigationMenuList className="flex-wrap justify-center gap-0">
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger
              className={cn(
                'h-10 sm:h-12 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium font-lato text-gray-700 hover:text-primary hover:bg-gray-50',
                'dark:text-gray-200 dark:hover:text-primary dark:hover:bg-gray-800',
                'data-[state=open]:text-primary data-[state=open]:bg-gray-50',
                'data-[active]:text-primary data-[active]:bg-gray-50',
                'dark:data-[state=open]:text-primary dark:data-[state=open]:bg-gray-800',
                'dark:data-[active]:text-primary dark:data-[active]:bg-gray-800'
              )}
            >
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[90vw] max-w-[400px] sm:w-[400px] lg:w-[500px] p-4 dark:bg-gray-800 dark:border-gray-700">
                <Link
                  href={category.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-gray-700"
                >
                  <div className="font-fredoka text-sm font-medium leading-none text-primary dark:text-blue-400">
                    Ver todo en {category.name}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground font-lato dark:text-gray-400">
                    Explora toda nuestra selección de {category.name.toLowerCase()}
                  </p>
                </Link>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
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
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground font-lato dark:text-gray-400">
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
  )
}

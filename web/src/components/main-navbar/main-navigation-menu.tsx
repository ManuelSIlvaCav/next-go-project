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
import React from 'react'
import { navigationData } from './navigation-data'

interface MainNavigationMenuProps {
  className?: string
}

export default function MainNavigationMenu({ className }: MainNavigationMenuProps) {
  return (
    <div className={cn('', className)}>
      <NavigationMenu className="max-w-full justify-start">
        <NavigationMenuList className="gap-6">
          {/* Shop - Direct Link */}
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'text-white hover:text-primary hover:bg-white/10 focus:text-primary focus:bg-white/10',
                'disabled:pointer-events-none disabled:opacity-50 font-fredoka text-xl',
              )}
            >
              <Link href={navigationData.shop.href} passHref>
                {navigationData.shop.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Health - Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-fredoka text-xl h-10 font-medium text-white bg-secondary hover:text-primary hover:bg-white/10 focus:text-primary focus:bg-white/10 data-[state=open]:text-primary data-[state=open]:bg-white/10">
              {navigationData.health.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-3 p-6 bg-white dark:bg-zinc-900">
                {navigationData.health.categories.map((category) => (
                  <ListItem key={category.id} title={category.title} href={category.href}>
                    {category.description}
                  </ListItem>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Services - Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="font-fredoka text-xl h-10 font-medium text-white bg-secondary hover:text-primary hover:bg-white/10 focus:text-primary focus:bg-white/10 data-[state=open]:text-primary data-[state=open]:bg-white/10">
              {navigationData.services.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-3 p-6 bg-white dark:bg-zinc-900">
                {navigationData.services.categories.map((category) => (
                  <ListItem key={category.id} title={category.title} href={category.href}>
                    {category.description}
                  </ListItem>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          'text-gray-900 dark:text-gray-100',
          className,
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </a>
    </NavigationMenuLink>
  )
})
ListItem.displayName = 'ListItem'

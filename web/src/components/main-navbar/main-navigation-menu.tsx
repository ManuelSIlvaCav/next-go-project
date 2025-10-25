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
              <ul className="grid w-[600px] grid-cols-2 gap-3 p-6 bg-white dark:bg-zinc-900">
                {navigationData.services.categories.map((category) => (
                  <ListItem key={category.id} title={category.title} href={category.href}>
                    {category.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { href: string }) {
  return (
    <div {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </div>
  )
}

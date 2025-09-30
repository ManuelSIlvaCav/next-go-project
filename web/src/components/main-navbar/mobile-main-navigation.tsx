'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { navigationData } from './navigation-data'

export default function MobileMainNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:text-primary hover:bg-white/10 [&_svg]:size-8"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          {/* Shop */}
          <Link
            href={navigationData.shop.href}
            className="block px-3 py-2 text-lg font-medium hover:bg-accent rounded-md"
          >
            {navigationData.shop.title}
          </Link>

          {/* Health */}
          <div>
            <Link
              href={navigationData.health.href}
              className="block px-3 py-2 text-lg font-medium hover:bg-accent rounded-md mb-2"
            >
              {navigationData.health.title}
            </Link>
            <div className="ml-6 space-y-1">
              {navigationData.health.categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <Link
              href={navigationData.services.href}
              className="block px-3 py-2 text-lg font-medium hover:bg-accent rounded-md mb-2"
            >
              {navigationData.services.title}
            </Link>
            <div className="ml-6 space-y-1">
              {navigationData.services.categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

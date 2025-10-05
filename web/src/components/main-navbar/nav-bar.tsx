import { cn } from '@/lib/utils'
import Link from 'next/link'
import AccountMenu from './account-menu'
import MainNavigationMenu from './main-navigation-menu'
import MobileMainNavigation from './mobile-main-navigation'
import ShoppingCart from './shopping-cart/shopping-cart'

interface NavBarProps {
  className?: string
}

export default function NavBar({ className }: NavBarProps) {
  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-50 bg-secondary dark:bg-secondary', className)}
    >
      {/* Main Navbar */}
      <div className="py-4 md:py-4 px-4 ">
        {/* Mobile and Desktop: Logo, Navigation, and Account/Cart */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <Link href="/">
                <div className="text-4xl font-bold text-white font-fredoka">
                  Pet<span className="text-primary">za</span>
                </div>
              </Link>
            </div>
            {/* Desktop Navigation Menu */}
            <div className="hidden md:block">
              <MainNavigationMenu />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AccountMenu />
            <ShoppingCart />
            {/* Mobile Menu */}
            <MobileMainNavigation />
          </div>
        </div>
      </div>
    </div>
  )
}

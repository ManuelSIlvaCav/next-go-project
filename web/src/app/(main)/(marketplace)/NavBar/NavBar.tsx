import { cn } from '@/lib/utils'
import Link from 'next/link'
import AccountMenu from './account-menu'
import AddressSelector from './address-selector'
import NavBarMobileMenu from './mobile-menu'
import SearchBar from './search-bar'
import ShoppingCart from './ShoppingCart/shopping-cart'

interface NavBarProps {
  className?: string
}

export default function NavBar({ className }: NavBarProps) {
  return (
    <div className={cn(className)}>
      {/* Main Navbar */}
      <div className="bg-linear-to-r from-secondary to-secondary-second  dark:from-purple-900 dark:to-blue-900 py-4 md:py-4 px-4">
        {/* Mobile do 2 rows 1. Menu/Logo ---- Account/Card */}
        {/* Desktop do  2 rows 1. all 2. only categories*/}
        <div className="flex flex-col gap-4 md: pt-2">
          <div className="flex flex-row justify-between md: px-4">
            <div className="flex">
              <NavBarMobileMenu />
              <div className="flex items-center">
                <Link href="/">
                  <div className="text-4xl font-bold text-white font-fredoka">
                    Pet<span className="text-primary">za</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-row pl-4 w-7xl items-center">
              <AddressSelector />
              <SearchBar />
            </div>
            <div className="flex">
              <AccountMenu />
              <ShoppingCart />
            </div>
          </div>
          <div className="flex flex-row md:hidden">
            <AddressSelector />
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  )
}

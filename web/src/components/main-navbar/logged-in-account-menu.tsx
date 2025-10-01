'use client'

import { ColorModeToggle } from '@/components/color-mode-toogle'
import LanguageSelector from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { ChevronDown, LogOut, Settings, User, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoggedInAccountMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully', {
      description: 'See you soon!',
    })
    setIsOpen(false)
    setIsMobileOpen(false)
  }

  const handleAccountSettings = () => {
    router.push('/account/settings')
    setIsOpen(false)
    setIsMobileOpen(false)
  }

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user?.first_name) {
      return user.first_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return ''
  }

  const getGreeting = () => {
    if (user?.first_name) {
      return `Hola, ${user.first_name}`
    }
    return 'Hola, '
  }

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block">
        <DropdownMenu
          open={isOpen}
          onOpenChange={(openStatus) => {
            setIsOpen(openStatus)
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-start text-white h-auto py-1 px-2 hover:bg-white group dark:hover:bg-primary"
            >
              <span className="text-xs text-gray-300 group-hover:text-primary dark:group-hover:text-white">
                {getGreeting()}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-white group-hover:text-primary dark:group-hover:text-white">
                  Cuenta
                </span>
                <ChevronDown className="h-3 w-3 group-hover:text-primary dark:group-hover:text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-72 bg-white dark:bg-purple-950 border-secondary dark:border-purple-800"
            align="end"
            sideOffset={8}
            alignOffset={0}
            avoidCollisions={true}
            collisionPadding={8}
          >
            {/* Header with User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-secondary dark:text-white truncate">
                    {getDisplayName()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <DropdownMenuItem
                onClick={handleAccountSettings}
                className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-900/50"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Configuración de cuenta
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-purple-800" />

            {/* Settings */}
            <div className="p-4 space-y-3">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-purple-900/50 border border-gray-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
                <ColorModeToggle />
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block px-1">
                  Idioma
                </label>
                <LanguageSelector />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden">
        <DropdownMenu open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-secondary [&_svg]:size-8 relative overflow-hidden"
            >
              <div className="relative">
                {/* User icon with fade out animation when open */}
                <User
                  className={`transition-all duration-300 ease-in-out ${
                    isMobileOpen
                      ? 'opacity-0 scale-75 rotate-180'
                      : 'opacity-100 scale-100 rotate-0'
                  }`}
                />

                {/* UserCircle icon with fade in animation when open */}
                <UserCircle
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isMobileOpen
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-75 rotate-180'
                  }`}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-72 bg-white dark:bg-purple-950 border-secondary dark:border-purple-800"
            align="end"
            sideOffset={8}
            avoidCollisions={true}
            collisionPadding={8}
          >
            {/* Header with User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-secondary dark:text-white truncate">
                    {getDisplayName()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <DropdownMenuItem
                onClick={handleAccountSettings}
                className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-900/50"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Configuración de cuenta
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-purple-800" />

            {/* Settings */}
            <div className="p-4 space-y-3">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-purple-900/50 border border-gray-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
                <ColorModeToggle />
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block px-1">
                  Idioma
                </label>
                <LanguageSelector />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

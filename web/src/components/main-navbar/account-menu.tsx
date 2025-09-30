'use client'

import { ColorModeToggle } from '@/components/color-mode-toogle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogIn, User, UserCircle, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()

  const handleSignInClick = () => {
    router.push('/login')
    setIsOpen(false)
  }

  const handleRegisterClick = () => {
    router.push('/register')
    setIsOpen(false)
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
                Hola, Inicia sesión
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
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-secondary dark:text-white">Mi Cuenta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Inicia sesión para acceder a todas las funciones
              </p>
            </div>

            {/* Sign In Button */}
            <div className="p-4 space-y-3">
              <Button
                onClick={handleSignInClick}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                onClick={handleRegisterClick}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-purple-800" />

            {/* Settings */}
            <div className="p-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-purple-900/50 border border-gray-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
                <ColorModeToggle />
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
              className="text-white hover:bg-secondary [&_svg]:size-8 relative overflow-hidden "
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
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-secondary dark:text-white">Mi Cuenta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Inicia sesión para acceder a todas las funciones
              </p>
            </div>

            {/* Sign In Button */}
            <div className="p-4 space-y-3">
              <Button
                onClick={() => {
                  router.push('/login')
                  setIsMobileOpen(false)
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                onClick={() => {
                  router.push('/register')
                  setIsMobileOpen(false)
                }}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 dark:bg-purple-800" />

            {/* Settings */}
            <div className="p-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-purple-900/50 border border-gray-200 dark:border-purple-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
                <ColorModeToggle />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

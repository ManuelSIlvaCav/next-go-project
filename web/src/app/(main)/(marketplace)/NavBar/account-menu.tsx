import { Button } from '@/components/ui/button'
import { ChevronDown, User } from 'lucide-react'

export default function AccountMenu() {
  return (
    <div>
      <Button
        variant="ghost"
        className="hidden md:flex flex-col items-start text-white hover:bg-gray-800 h-auto py-1 px-2"
      >
        <span className="text-xs text-gray-300">Hola, Inicia sesión</span>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">Cuenta</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </Button>
      <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-800">
        <User className="h-5 w-5" />
      </Button>
    </div>
  )
}

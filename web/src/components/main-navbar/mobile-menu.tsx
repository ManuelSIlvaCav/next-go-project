import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export default function NavBarMobileMenu() {
  return (
    <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-gray-800">
      <Menu className="h-5 w-5" />
    </Button>
  )
}

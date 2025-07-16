import { ChevronDown, Globe } from 'lucide-react'
import { Button } from './ui/button'

export default function LanguageSelect() {
  return (
    <Button
      variant="ghost"
      className="hidden lg:flex items-center text-white hover:bg-gray-800 space-x-1"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm">ES</span>
      <ChevronDown className="h-3 w-3" />
    </Button>
  )
}

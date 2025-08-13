import { Button } from '@/components/ui/button'
import { ShoppingCartIcon } from 'lucide-react'

export default function ShoppingCart() {
  return (
    <div>
      <Button
        variant="ghost"
        className="text-white hover:border-white relative flex items-center space-x-1 [&_svg]:size-8"
      >
        <div className="relative">
          <ShoppingCartIcon />
          <span className="font-fredoka absolute -top-1 -right-1  h-4 w-4 flex items-center justify-center font-bold text-white text-md rounded-full bg-complement">
            3
          </span>
        </div>
      </Button>
    </div>
  )
}

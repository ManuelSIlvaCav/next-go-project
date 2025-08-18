import { Button } from '@/components/ui/button'
import { MinusIcon, PencilIcon, PlusIcon } from 'lucide-react'
import Image from 'next/image'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  description?: string
  extras?: string[]
}

interface ShoppingCartItemProps {
  item: CartItem
  onQuantityChange?: (id: string, quantity: number) => void
  onEdit?: (id: string) => void
  onRemove?: (id: string) => void
}

export default function ShoppingCartItem({
  item,
  onQuantityChange,
  onEdit,
  onRemove,
}: ShoppingCartItemProps) {
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange?.(item.id, item.quantity - 1)
    } else {
      onRemove?.(item.id)
    }
  }

  const handleQuantityIncrease = () => {
    onQuantityChange?.(item.id, item.quantity + 1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+'
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{item.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => onEdit?.(item.id)}
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>

        {item.description && <p className="text-xs text-gray-600 mb-1">{item.description}</p>}

        {item.extras && item.extras.length > 0 && (
          <div className="mb-2">
            {item.extras.map((extra, index) => (
              <p key={index} className="text-xs text-gray-500">
                • {extra}
              </p>
            ))}
          </div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{formatPrice(item.price)}</span>
              {item.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={handleQuantityDecrease}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>

            <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>

            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={handleQuantityIncrease}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

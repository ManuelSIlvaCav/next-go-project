import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutCartItemsProps {
  items: CartItem[]
}

export function CheckoutCartItems({ items }: CheckoutCartItemsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Tu pedido
      </h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            {/* Quantity Badge */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-md relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xOCAxOEgzMFYzMEgxOFYxOFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+'
                  }}
                />
              </div>
              {item.quantity > 1 && (
                <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.name}
              </p>
            </div>

            {/* Price */}
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

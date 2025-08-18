'use client'
import { AddressInput } from '@/components/address-input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronDownIcon, MapPinIcon, ShoppingCartIcon } from 'lucide-react'
import { useState } from 'react'

import { OrderDetail, ShoppingCartItem, type CartItem } from '.'

// Mock data for cart items
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: '"NUEVO" Tartaro de Res',
    price: 15990,
    quantity: 1,
    image: 'https://picsum.photos/200/300',
    description: 'Receta de estilo del fin cruder carne prime',
  },
  {
    id: '2',
    name: 'Promo Acevichados',
    price: 26490,
    originalPrice: 30490,
    quantity: 1,
    image: 'https://picsum.photos/200/300',
    description: 'Agregar pan',
    extras: ['Porción pan ciabatta'],
  },
]

export default function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  // Cart manipulation functions
  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const handleEditItem = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', id)
  }

  const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  )
  const discounts = cartItems.reduce((sum: number, item: CartItem) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
  const total = subtotal

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:border-white relative flex items-center space-x-1 [&_svg]:size-8"
        >
          <div className="relative">
            <ShoppingCartIcon />
            <span className="font-fredoka absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center font-bold text-white text-xs rounded-full bg-complement">
              {totalItems}
            </span>
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col h-full p-0">
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle className="text-left text-xl font-bold">Tu Carrito ({totalItems})</SheetTitle>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">¿Dónde quieres pedir?</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
            <AddressInput
              placeholder="Ingresa tu dirección o selecciona un local para continuar"
              className="w-full"
              countryRestriction="cl"
              onAddressSelect={(address) => {
                setSelectedAddress(address.placePrediction?.text?.text || '')
              }}
            />
          </div>
        </SheetHeader>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <ShoppingCartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onEdit={handleEditItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCartIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500">Agrega productos para comenzar tu pedido</p>
            </div>
          )}
        </div>

        {/* Order Detail */}
        {cartItems.length > 0 && (
          <div className="border-t px-6 pt-4">
            <OrderDetail subtotal={subtotal} discounts={discounts} total={total} />
          </div>
        )}

        <SheetFooter>
          {/* Action Button */}
          <div className="px-6 pt-4 pb-6">
            <Button
              className="w-full bg-complement hover:bg-complement/90 text-white font-bold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedAddress || cartItems.length === 0}
            >
              Continuar
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

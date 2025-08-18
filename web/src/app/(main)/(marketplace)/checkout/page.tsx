'use client'

import { useState } from 'react'
import { CheckoutActions } from './CheckoutActions'
import { CheckoutCartItems } from './CheckoutCartItems'
import { CheckoutForm } from './CheckoutForm'
import { CheckoutHeader } from './CheckoutHeader'
import { OrderSummary } from './OrderSummary'

// Mock data - in real app this would come from context/state management
const mockCartItems = [
  {
    id: '1',
    name: 'Revolution Plus Gato 5 - 10kg (1ml)',
    price: 12990,
    quantity: 1,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: '2',
    name: 'Arena Angora Carbón Activado 24kg (2x12Kg)',
    price: 29490,
    quantity: 1,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: '3',
    name: 'Arena Angora Carbón Activado 12kg',
    price: 13290,
    quantity: 1,
    image: 'https://picsum.photos/200/300',
  },
]

export default function MarketplaceCheckoutPage() {
  const [formData, setFormData] = useState({
    contact: { email: '', phone: '' },
    delivery: { name: '', lastName: '', address: '', phone: '' },
    shipping: { method: 'delivery', region: 'Santiago', commune: 'Santiago' },
    payment: { method: 'credit-card' },
    donation: { amount: 0, isEnabled: false },
  })

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const donation = formData.donation.isEnabled ? formData.donation.amount : 0
  const total = subtotal + shipping + donation

  const handleFormChange = (section: string, data: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section as keyof typeof prev] as object), ...(data as object) },
    }))
  }

  const handleCheckout = () => {
    console.log('Proceeding to payment with:', { formData, cartItems: mockCartItems, total })
    // Here you would integrate with payment processor
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content - Mobile First */}
          <div className="lg:col-span-7">
            {/* Cart Items - Mobile */}
            <div className="lg:hidden mb-6">
              <CheckoutCartItems items={mockCartItems} />
            </div>

            {/* Checkout Form */}
            <CheckoutForm formData={formData} onFormChange={handleFormChange} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            {/* Cart Items - Desktop */}
            <div className="hidden lg:block mb-6">
              <CheckoutCartItems items={mockCartItems} />
            </div>

            {/* Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              donation={donation}
              total={total}
              itemCount={mockCartItems.length}
            />

            {/* Action Button */}
            <CheckoutActions
              total={total}
              onCheckout={handleCheckout}
              disabled={!formData.contact.email}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

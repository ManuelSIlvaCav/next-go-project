import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  donation?: number
  total: number
  itemCount: number
}

export function OrderSummary({
  subtotal,
  shipping,
  donation = 0,
  total,
  itemCount,
}: OrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleApplyDiscount = () => {
    console.log('Applying discount code:', discountCode)
    // TODO: Implement discount logic
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>

      {/* Discount Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Código de descuento o tarjeta de regalo"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleApplyDiscount} disabled={!discountCode.trim()}>
            Aplicar
          </Button>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal · {itemCount} artículos</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="font-medium text-green-600">
            {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
          </span>
        </div>

        {donation > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Donación</span>
            <span className="font-medium text-green-600">{formatPrice(donation)}</span>
          </div>
        )}

        <hr className="border-gray-200" />

        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <div className="text-right">
            <div className="text-lg font-semibold">CLP {formatPrice(total)}</div>
            <div className="text-xs text-gray-500">Incluye $8.904 de impuestos</div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-3">
          Ya que estás aquí... ¡esto les encantará! 🐶🐱
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-yellow-300 rounded-lg bg-yellow-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
              <div>
                <p className="text-sm font-medium">Arena Sanitaria Fashion Cat</p>
                <p className="text-xs text-gray-500">(29% DE DESCUENTO)</p>
                <p className="text-sm font-semibold">
                  $16.990 <span className="text-xs text-gray-400 line-through">$23.990</span>
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Añadir
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
              <div>
                <p className="text-sm font-medium">Bravery Gato Adulto Esterilizado</p>
                <p className="text-xs text-gray-500">(8% DE DESCUENTO)</p>
                <p className="text-sm font-semibold">
                  $16.990 <span className="text-xs text-gray-400 line-through">$18.490</span>
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Añadir
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

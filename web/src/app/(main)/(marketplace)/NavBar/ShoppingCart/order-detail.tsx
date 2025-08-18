interface OrderDetailProps {
  subtotal: number
  discounts: number
  deliveryFee?: number
  serviceFee?: number
  total: number
}

export default function OrderDetail({ 
  subtotal, 
  discounts, 
  deliveryFee = 0, 
  serviceFee = 0, 
  total 
}: OrderDetailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-base">Detalle del Pedido</h3>
      
      <div className="space-y-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-gray-600">Total Productos</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Discounts */}
        {discounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuentos</span>
            <span>-{formatPrice(discounts)}</span>
          </div>
        )}

        {/* Delivery Fee */}
        {deliveryFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Costo de Envío</span>
            <span className="font-medium">{formatPrice(deliveryFee)}</span>
          </div>
        )}

        {/* Service Fee */}
        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Comisión de Servicio</span>
            <span className="font-medium">{formatPrice(serviceFee)}</span>
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'

interface CheckoutActionsProps {
  total: number
  onCheckout: () => void
  disabled?: boolean
}

export function CheckoutActions({ total, onCheckout, disabled }: CheckoutActionsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="mt-6">
      <Button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 text-lg"
        size="lg"
      >
        Pagar ahora - {formatPrice(total)}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Ya que estás aquí... ¡esto les encantará! 🐶🐱
      </p>
    </div>
  )
}

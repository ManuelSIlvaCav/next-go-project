import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export function CheckoutHeader() {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 flex-row sm:px-6 lg:px-8">
        <div>
          <Link
            href="/products"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Link>
        </div>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>
    </section>
  )
}

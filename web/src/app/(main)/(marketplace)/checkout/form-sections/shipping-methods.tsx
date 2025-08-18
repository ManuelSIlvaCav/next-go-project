import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { InfoIcon, MapPinIcon, TruckIcon } from 'lucide-react'

interface ShippingData {
  method: string
  region: string
  commune: string
}

interface ShippingMethodProps {
  data: ShippingData
  onChange: (data: Partial<ShippingData>) => void
}

export function ShippingMethod({ data, onChange }: ShippingMethodProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Métodos de envío</h3>

      {/* Shipping Options Notice */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
        <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Las opciones de envío de tu pedido han cambiado. Revisa tu selección.
        </p>
      </div>

      <div className="space-y-3">
        {/* Home Delivery */}
        <div className="flex items-center space-x-3 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
          <input
            type="radio"
            id="delivery"
            name="shipping"
            value="delivery"
            checked={data.method === 'delivery'}
            onChange={(e) => onChange({ method: e.target.value })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <TruckIcon className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="delivery" className="font-medium cursor-pointer">
                Despacho a domicilio - Santiago
              </Label>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                GRATIS
              </Badge>
            </div>
          </div>
        </div>

        {/* Store Pickup */}
        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input
            type="radio"
            id="pickup"
            name="shipping"
            value="pickup"
            checked={data.method === 'pickup'}
            onChange={(e) => onChange({ method: e.target.value })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <MapPinIcon className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pickup" className="font-medium cursor-pointer">
                  Retiro en Bodega Las Condes (RM) - Petvet
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Retira hoy a partir de las 11:49.
                  <br />
                  Dirección: Avda. Pdte. Sebastián Piñera E., 343.
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                GRATIS
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

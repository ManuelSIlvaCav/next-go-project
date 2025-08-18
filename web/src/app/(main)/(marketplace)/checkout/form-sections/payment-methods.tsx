import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShieldCheckIcon } from 'lucide-react'

interface PaymentData {
  method: string
}

interface PaymentMethodProps {
  data: PaymentData
  onChange: (data: Partial<PaymentData>) => void
}

export function PaymentMethod({ data, onChange }: PaymentMethodProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pago</h3>

      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
        <ShieldCheckIcon className="h-4 w-4" />
        <span>Todas las transacciones son seguras y están encriptadas.</span>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        {/* Credit Card */}
        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="radio"
              id="credit-card"
              name="payment"
              value="credit-card"
              checked={data.method === 'credit-card'}
              onChange={(e) => onChange({ method: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label
              htmlFor="credit-card"
              className="font-medium cursor-pointer flex items-center space-x-2"
            >
              <span>Tarjeta crédito, débito o prepago</span>
              <div className="flex space-x-1">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">VISA</span>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">MC</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">AMEX</span>
              </div>
            </Label>
          </div>

          {data.method === 'credit-card' && (
            <div className="space-y-4 pl-7">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                  Número de tarjeta
                </Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                    Fecha de vencimiento (MM / AA)
                  </Label>
                  <Input id="expiry" placeholder="MM / AA" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                    Código de seguridad
                  </Label>
                  <Input id="cvv" placeholder="123" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
                  Nombre del titular
                </Label>
                <Input
                  id="cardName"
                  placeholder="Nombre como aparece en la tarjeta"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="docType" className="text-sm font-medium text-gray-700">
                    Documento
                  </Label>
                  <Select defaultValue="rut">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rut">RUT</SelectItem>
                      <SelectItem value="passport">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="docNumber" className="text-sm font-medium text-gray-700">
                    Número de documento
                  </Label>
                  <Input id="docNumber" placeholder="12.345.678-9" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="installments" className="text-sm font-medium text-gray-700">
                  Cuotas
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 cuota</SelectItem>
                    <SelectItem value="3">3 cuotas</SelectItem>
                    <SelectItem value="6">6 cuotas</SelectItem>
                    <SelectItem value="12">12 cuotas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-gray-500">
                Si hay intereses, los aplicará y cobrará tu banco.
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox id="billingAddress" />
                <Label htmlFor="billingAddress" className="text-sm text-gray-600 cursor-pointer">
                  Usar la dirección de envío como dirección de facturación
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* MercadoPago */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="mercadopago"
              name="payment"
              value="mercadopago"
              checked={data.method === 'mercadopago'}
              onChange={(e) => onChange({ method: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label
              htmlFor="mercadopago"
              className="font-medium cursor-pointer flex items-center space-x-2"
            >
              <span>Mercado Pago - Crédito o Débito</span>
              <div className="flex space-x-1">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">MP</span>
              </div>
            </Label>
          </div>
        </div>

        {/* Klap */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="klap"
              name="payment"
              value="klap"
              checked={data.method === 'klap'}
              onChange={(e) => onChange({ method: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label htmlFor="klap" className="font-medium cursor-pointer">
              Klap - Crédito, Débito, Google Pay o Apple Pay
            </Label>
          </div>
        </div>

        {/* Flow */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="flow"
              name="payment"
              value="flow"
              checked={data.method === 'flow'}
              onChange={(e) => onChange({ method: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label htmlFor="flow" className="font-medium cursor-pointer">
              Flow - Webpay, MACH
            </Label>
          </div>
        </div>

        {/* Bank Transfer */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="bank-transfer"
              name="payment"
              value="bank-transfer"
              checked={data.method === 'bank-transfer'}
              onChange={(e) => onChange({ method: e.target.value })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label htmlFor="bank-transfer" className="font-medium cursor-pointer">
              Fintoc - Transferencia Bancaria
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}

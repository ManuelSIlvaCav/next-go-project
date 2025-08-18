import { AddressInput } from '@/components/address-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DeliveryData {
  name: string
  lastName: string
  address: string
  phone: string
}

interface DeliveryDetailsProps {
  data: DeliveryData
  onChange: (data: Partial<DeliveryData>) => void
}

export function DeliveryDetails({ data, onChange }: DeliveryDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Entrega</h3>

      <div className="space-y-4">
        {/* Country/Region */}
        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            País / Región
          </Label>
          <Select defaultValue="chile">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chile">Chile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre *
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nombre"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Apellidos *
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Apellidos"
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Dirección *
          </Label>
          <AddressInput
            placeholder="Ingresa tu dirección"
            className="mt-1"
            countryRestriction="cl"
            onAddressSelect={(address) => {
              onChange({ address: address.placePrediction?.text?.text || '' })
            }}
          />
        </div>

        {/* Apartment/Additional Info */}
        <div>
          <Label htmlFor="apartment" className="text-sm font-medium text-gray-700">
            Casa, apartamento, etc. (opcional)
          </Label>
          <Input id="apartment" placeholder="Información adicional" className="mt-1" />
        </div>

        {/* Postal Code and City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Código postal (opcional)
            </Label>
            <Input id="postalCode" placeholder="Código postal" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Comuna
            </Label>
            <Select defaultValue="santiago">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar comuna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="santiago">Santiago</SelectItem>
                <SelectItem value="providencia">Providencia</SelectItem>
                <SelectItem value="las-condes">Las Condes</SelectItem>
                <SelectItem value="vitacura">Vitacura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Region */}
        <div>
          <Label htmlFor="region" className="text-sm font-medium text-gray-700">
            Región
          </Label>
          <Select defaultValue="santiago">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="santiago">Santiago</SelectItem>
              <SelectItem value="valparaiso">Valparaíso</SelectItem>
              <SelectItem value="biobio">Biobío</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="deliveryPhone" className="text-sm font-medium text-gray-700">
            Teléfono
          </Label>
          <Input
            id="deliveryPhone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+56 9 1234 5678"
            className="mt-1"
          />
        </div>

        {/* Save Info Checkbox */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="saveInfo"
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer">
            Guardar mi información y consultar más rápidamente la próxima vez
          </Label>
        </div>
      </div>
    </div>
  )
}

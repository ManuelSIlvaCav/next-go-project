import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface ContactData {
  email: string
  phone: string
}

interface ContactDetailsProps {
  data: ContactData
  onChange: (data: Partial<ContactData>) => void
}

export function ContactDetails({ data, onChange }: ContactDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Contacto
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="tu@correo.com"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Teléfono *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+56 9 1234 5678"
            className="mt-1"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="newsletter" />
          <Label 
            htmlFor="newsletter" 
            className="text-sm text-gray-600 cursor-pointer"
          >
            Recibir cupones de descuento y ofertas por correo
          </Label>
        </div>
      </div>
    </div>
  )
}

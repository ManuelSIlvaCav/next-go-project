import { ContactDetails } from './form-sections/contact-details'
import { DeliveryDetails } from './form-sections/delivery-details'
import { PaymentMethod } from './form-sections/payment-methods'
import { ShippingMethod } from './form-sections/shipping-methods'

interface ContactData {
  email: string
  phone: string
}

interface DeliveryData {
  name: string
  lastName: string
  address: string
  phone: string
}

interface ShippingData {
  method: string
  region: string
  commune: string
}

interface PaymentData {
  method: string
}

interface DonationData {
  amount: number
  isEnabled: boolean
}

interface FormData {
  contact: ContactData
  delivery: DeliveryData
  shipping: ShippingData
  payment: PaymentData
  donation: DonationData
}

interface CheckoutFormProps {
  formData: FormData
  onFormChange: (section: keyof FormData, data: unknown) => void
}

export function CheckoutForm({ formData, onFormChange }: CheckoutFormProps) {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <ContactDetails
        data={formData.contact}
        onChange={(data: Partial<ContactData>) => onFormChange('contact', data)}
      />

      {/* Delivery Details */}
      <DeliveryDetails
        data={formData.delivery}
        onChange={(data: Partial<DeliveryData>) => onFormChange('delivery', data)}
      />

      {/* Shipping Method */}
      <ShippingMethod
        data={formData.shipping}
        onChange={(data: Partial<ShippingData>) => onFormChange('shipping', data)}
      />

      {/* Payment Method */}
      <PaymentMethod
        data={formData.payment}
        onChange={(data: Partial<PaymentData>) => onFormChange('payment', data)}
      />
    </div>
  )
}

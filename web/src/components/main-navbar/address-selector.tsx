'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import { useState } from 'react'

export default function AddressSelector() {
  const [postcode, setPostcode] = useState('')
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState('Seleccionar dirección')

  const handleAddressSubmit = () => {
    if (postcode.trim()) {
      setCurrentAddress(`Entregar en ${postcode}`)
      setIsAddressDialogOpen(false)
      setPostcode('')
    }
  }

  return (
    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="md:flex flex-col items-start text-white hover:bg-gray-800 h-auto py-1 px-2 [&_svg]:size-6 md:[&_svg]:size-4"
        >
          <div className="hidden md:flex flex-col items-start">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs text-gray-300">Entregar en</span>
            </div>
            <span className="text-sm font-medium text-white truncate max-w-32">
              {currentAddress}
            </span>
          </div>
          <div className="md:hidden flex ">
            <MapPin size={36} />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar dirección de entrega</DialogTitle>
          <DialogDescription>
            Ingresa tu código postal para ver productos disponibles en tu área
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">Código postal</Label>
            <Input
              id="postcode"
              placeholder="Ej: 28001"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddressSubmit}>Aplicar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

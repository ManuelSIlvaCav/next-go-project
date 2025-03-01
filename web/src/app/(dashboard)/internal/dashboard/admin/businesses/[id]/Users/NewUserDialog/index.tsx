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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NewUserForm from './new-user-form'

export default function NewUserDialog(props: { businessId: string; jwt: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Agregar Usuario</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">Registrar nuevo usuario</DialogTitle>
            <DialogDescription className="sm:text-center">
              Ingresa los datos de un nuevo usuario
            </DialogDescription>
          </DialogHeader>
        </div>

        <NewUserForm
          businessId={props.businessId}
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
          jwt={props.jwt}
        />
      </DialogContent>
    </Dialog>
  )
}

'use client'

import TextInput from '@/components/form/text-input'
import { useJwt } from '@/components/providers/jwt-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import createBusinessRequest from '@/lib/actions/create-business'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  name: z.string(),
  legal_name: z.string(),
  identifier: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

/* export type CreateBusinessFormProps = { 
} */

export default function CreateBusinessForm() {
  const { jwt } = useJwt()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: createBusinessRequest,
    onSuccess: () => {
      toast('Business created', {
        description: 'The business has been created successfully',
        position: 'top-right',
      })
      router.push('/internal/dashboard/admin/businesses')
      router.refresh()
    },
    onError: (error) => {
      toast('Error', {
        description: error.message,
        position: 'top-right',
      })
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      legal_name: '',
      identifier: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    mutation.mutate({ apiParams: { jwt }, ...values })
  }

  const formAvailable = form.formState.isSubmitting || form.formState.isSubmitSuccessful

  return (
    <Card className="w-full max-w-md p-4">
      <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextInput form={form} fieldName="name" label="Name" placeholder="Enter your name" />
          <TextInput
            form={form}
            fieldName="legal_name"
            label="Nombre legal"
            placeholder="Empresa S.A."
          />
          <TextInput
            form={form}
            fieldName="identifier"
            label="Rut empresa"
            placeholder="12.345.678-9"
          />

          <div>
            <Button type="submit" className="mt-0! w-full" disabled={formAvailable}>
              {formAvailable ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                'Crear'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

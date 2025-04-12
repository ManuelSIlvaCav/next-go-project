'use client'

import TextInput from '@/components/form/text-input'
import { useJwt } from '@/components/providers/JwtProvider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import createBusinessRequest from '@/lib/actions/create-business'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
  const { toast } = useToast()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: createBusinessRequest,
    onSuccess: () => {
      toast({
        title: 'Business created',
        description: 'The business has been created successfully',
        position: 'top-right',
      })
      router.push('/internal/dashboard/admin/businesses')
      router.refresh()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
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
    mutation.mutate({ apiParams: { jwt }, ...values })
  }

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
            <Button type="submit" className="!mt-0 w-full" isLoading={form.formState.isSubmitting}>
              Crear
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

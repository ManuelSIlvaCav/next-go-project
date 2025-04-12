'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'

import TextInput from '@/components/form/text-input'
import { useJwt } from '@/components/providers/JwtProvider'
import { Form } from '@/components/ui/form'
import { ApiParams } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
})

type FormValues = z.infer<typeof FormSchema>

export type NewUserFormProps = {
  businessId: string
  onSuccess: () => void
}

async function createNewUser(
  apiParams: ApiParams,
  businessId: string,
  data: { first_name: string; last_name: string; email: string },
) {
  try {
    // Fetch data from your API here.
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses/${businessId}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiParams.jwt}`,
        },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        }),
      },
    )
    const jsonResponse = await response.json()

    if (!response.ok || response.status !== 201) {
      throw new Error(jsonResponse.message)
    }

    console.log('data', jsonResponse)

    return jsonResponse.data
  } catch (error) {
    console.error('Error fetching data', error)
    throw new Error('Error fetching data')
  }
}

export default function NewUserForm(props: NewUserFormProps) {
  const { jwt } = useJwt()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues & { apiParams: ApiParams; businessId: string }) =>
      createNewUser(data.apiParams, data.businessId, data),
    onSuccess: () => {
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente',
      })
      props.onSuccess()
    },
    onError: (error) => {
      toast({
        title: 'Error al crear usuario',
        description: error.message,
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    console.log('values', values)
    mutation.mutate({
      apiParams: { jwt },
      businessId: props.businessId,
      ...values,
    })
  }

  return (
    <Form {...form}>
      <form action="" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <TextInput placeholder="John" form={form} fieldName="first_name" label="Nombre" />
            </div>
            <div className="flex-1 space-y-2">
              <TextInput placeholder="Doe" form={form} fieldName="last_name" label="Apellido" />
            </div>
          </div>
          <div className="space-y-2">
            <TextInput
              placeholder="hi@yourcompany.com"
              form={form}
              fieldName="email"
              label="Email"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Crear Usuario
        </Button>
      </form>
    </Form>
  )
}

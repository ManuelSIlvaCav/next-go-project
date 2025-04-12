'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'

import TextInput from '@/components/form/text-input'
import { useJwt } from '@/components/providers/JwtProvider'
import { Form } from '@/components/ui/form'
import { updateBusinessSettings } from '@/lib/actions/update-business-settings'
import { ApiParams } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  subdomain: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

export type SettingsFormProps = {
  businessId: string
}

export default function SettingsForm(props: SettingsFormProps) {
  const { jwt } = useJwt()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subdomain: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues & { apiParams: ApiParams; businessId: string }) =>
      updateBusinessSettings(data.apiParams, data.businessId, data),
    onSuccess: () => {
      toast({
        title: 'Información actualizada',
        description: 'La configuración de la empresa ha sido actualizada',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error al actualizar la configuración',
        description: error.message,
        variant: 'destructive',
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
              <TextInput
                placeholder="ex. google.com"
                form={form}
                fieldName="subdomain"
                label="Dominio"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Actualizar configuración
        </Button>
      </form>
    </Form>
  )
}

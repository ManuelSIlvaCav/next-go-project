'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  email: z.string().email(),
})

type LoginFormProps = {
  ui: string
  redirectUrl?: string
  onSubmit: (data: z.infer<typeof FormSchema>, callbackfn: () => void) => void
}

export default function LoginForm(props: LoginFormProps) {
  //const { redirectUrl = '/internal/login/redirect', ui } = props

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /* Send a request to backend creating a magic login depending on user/admin */
    function onSubmitCallback() {
      toast({
        title: 'Correo ha sido enviado',
        description: (
          <>
            <div>Hemos enviado un correo para validar tu identidad</div>
          </>
        ),
      })
      //router.push(redirectURL)
    }

    props.onSubmit(data, onSubmitCallback)
  }

  return (
    <div className="items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoer@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import createLoginRequest from '@/lib/actions/login-request'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import LoginForm from '../../login/form'

export default function AdminLogin() {
  const mutation = useMutation({
    mutationFn: createLoginRequest,
  })

  function onSubmit(data: { email: string }, callbackfn: () => void) {
    mutation.mutate(
      { type: 'email-only', ...data },
      {
        onSuccess: () => {
          callbackfn()
        },
        onError: (error) => {
          toast.error(error?.message, {
            description: 'Retry with a different email.',
            position: 'top-right',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        },
      },
    )
  }

  return (
    <main className="overflow-hidden">
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md ">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Ingresa tu correo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col px-6">
              <LoginForm ui="admin" onSubmit={onSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import createLoginRequest from '@/lib/actions/login-request'
import { useMutation } from '@tanstack/react-query'
import LoginForm from '../../login/form'

export default function AdminLogin() {
  const { toast } = useToast()

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
          toast({
            variant: 'destructive',
            title: 'Error in login',
            description: error.message,
            position: 'top-right',
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

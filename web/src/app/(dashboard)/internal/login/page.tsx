import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Metadata } from 'next'
import LoginForm from './form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account to continue.',
}

export default function Login() {
  return (
    <main className="overflow-hidden">
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md ">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Ingresa tu correo</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm ui={'user'} />
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

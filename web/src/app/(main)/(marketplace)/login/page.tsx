'use client'

import { Card, CardContent } from '@/components/ui/card'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 mt-[5rem]">
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        {/* Login Form Card */}
        <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 sm:p-8">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

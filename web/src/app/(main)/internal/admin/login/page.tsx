'use client'

import LoginForm from '@/app/(main)/(marketplace)/login/login-form'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-fredoka mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-lato">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <LoginForm type="admin" redirectPath="/internal/dashboard" />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}

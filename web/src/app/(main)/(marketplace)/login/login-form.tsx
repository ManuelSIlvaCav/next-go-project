'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { loginClient } from '@/lib/api/auth'
import { useMutation } from '@tanstack/react-query'
import { useSetCookie } from 'cookies-next'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const t = useTranslations('LoginPage')
  const router = useRouter()
  const setCookie = useSetCookie()
  const { refreshAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // TanStack Query mutation for login
  const loginMutation = useMutation({
    mutationFn: loginClient,
    onSuccess: (data) => {
      toast.success('Login successful!', {
        description: `Welcome back, ${data.client.email}`,
      })
      setCookie('petza_access_token', data.access_token)

      // Store user data in localStorage
      localStorage.setItem('petza_user', JSON.stringify(data.client))

      // Refresh auth state using Context
      refreshAuth()

      if (onSubmit) {
        onSubmit(loginForm)
      }

      // Redirect to home page
      router.push('/')
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error('Login failed', {
        description: error.message,
      })
    },
  })

  // Zod schema for validation
  const loginSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
    password: z.string().min(1, t('passwordRequired')),
  })

  const validateForm = () => {
    try {
      loginSchema.parse(loginForm)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleFormChange = (field: 'email' | 'password', value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleLogin = () => {
    if (validateForm()) {
      // Call the login API
      loginMutation.mutate({
        email: loginForm.email,
        password: loginForm.password,
        business_id: 1, // Hardcoded business_id
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-fredoka">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            {t('emailLabel')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={loginForm.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
            {t('passwordLabel')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              value={loginForm.password}
              onChange={(e) => handleFormChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <Button
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium mt-6"
        >
          {loginMutation.isPending ? t('loggingIn') : t('loginButton')}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

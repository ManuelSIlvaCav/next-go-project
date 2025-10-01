'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { registerClient } from '@/lib/api/auth'
import { useMutation } from '@tanstack/react-query'
import { useSetCookie } from 'cookies-next'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

// Zod schema for validation
const userSignupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type UserFormData = z.infer<typeof userSignupSchema>

interface UserSignupProps {
  onNext: (userData: UserFormData) => void
  initialData?: UserFormData
}

export default function UserSignup({ onNext, initialData }: UserSignupProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const setCookie = useSetCookie()
  const { refreshAuth } = useAuth()

  const [userForm, setUserForm] = useState<UserFormData>(
    initialData || {
      email: '',
      password: '',
      confirmPassword: '',
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // TanStack Query mutation for registration
  const registerMutation = useMutation({
    mutationFn: registerClient,
    onSuccess: (data) => {
      toast.success('Account created successfully!', {
        description: 'Welcome to our platform',
      })
      setCookie('petza_access_token', data.access_token)

      // Store user data in localStorage
      localStorage.setItem('petza_user', JSON.stringify(data.client))

      // Refresh auth state using Context
      refreshAuth()

      onNext(userForm)
    },
    onError: (error: Error) => {
      toast.error('Registration failed', {
        description: error.message,
      })
    },
  })

  const validateForm = () => {
    try {
      userSignupSchema.parse(userForm)
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

  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Call the registration API
      registerMutation.mutate({
        email: userForm.email,
        password: userForm.password,
        confirm_password: userForm.confirmPassword,
        business_id: 1, // Hardcoded business_id as requested
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-fredoka">
          Create your account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Join our community of pet lovers</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={userForm.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={userForm.password}
              onChange={(e) => handleFormChange('password', e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={userForm.confirmPassword}
              onChange={(e) => handleFormChange('confirmPassword', e.target.value)}
              className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={registerMutation.isPending}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium mt-6"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

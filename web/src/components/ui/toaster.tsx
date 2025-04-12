'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react'

function buildToastIcon(params: { variant: string }) {
  const { variant } = params

  if (variant === 'default') {
    return (
      <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} aria-hidden="true" />
    )
  }

  return <CircleAlertIcon className="mt-0.5 shrink-0 text-red-500" size={16} aria-hidden="true" />
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = props.variant || 'default'
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2">
              <div className="flex grow gap-3">
                {buildToastIcon({ variant })}
                <div className="flex grow flex-col gap-3">
                  <div className="space-y-1">
                    <ToastTitle>
                      {typeof title === 'string' ? (
                        <p className="text-sm font-medium">{title}</p>
                      ) : (
                        title
                      )}
                    </ToastTitle>
                    <ToastDescription>
                      {typeof description === 'string' ? (
                        <p className="text-muted-foreground text-sm">{description}</p>
                      ) : (
                        description
                      )}
                    </ToastDescription>
                  </div>
                  <div className="flex gap-2">{action}</div>
                </div>
              </div>
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

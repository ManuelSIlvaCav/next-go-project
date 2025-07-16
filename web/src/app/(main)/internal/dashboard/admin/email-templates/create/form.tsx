'use client'

import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const EmailEditorForm = dynamic(() => import('../../../emails/EmailEditorForm'), {
  loading: () => <Skeleton />,
})

export default function CreateEmailForm() {
  const router = useRouter()

  return (
    <EmailEditorForm
      onSubmit={() => {
        console.log('onSubmit')
        router.push('/internal/dashboard/admin/email-templates')
      }}
    />
  )
}

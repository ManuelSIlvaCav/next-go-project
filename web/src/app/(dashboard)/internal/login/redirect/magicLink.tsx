'use client'

import loginMagicLink from '@/lib/actions/loginMagicLink'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MagicLink({
  email,
  token,
  userInfo,
}: {
  email: string
  token: string
  userInfo: string
}) {
  const { push } = useRouter()

  const { data, isPending } = useQuery({
    queryKey: ['magicLink', { email, token, adminLogin: userInfo === 'admin' }],
    queryFn: ({ queryKey }) =>
      loginMagicLink(queryKey[1] as { email: string; token: string; adminLogin: boolean }),
  })

  /* We grab the query params email and token */
  /* We call the loginMagicLink function with the email and token */

  console.log('respt', { data, isPending })

  useEffect(() => {
    if (data?.data) {
      push('/internal/dashboard')
    }
  }, [JSON.stringify(data)])

  return (
    <div className="flex flex-col  space-y-4 overflow-hidden">
      <div className="text-2xl font-bold">Logging you in...</div>
      <div className="text-lg">{isPending ? 'Please wait...' : ''}</div>
      {data?.error && <div className="text-red-500 text-lg">{data?.error}</div>}
    </div>
  )
}

'use client'

import loginMagicLink from '@/lib/actions/login-magic-link'
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
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    console.log('data', data)
    if (data?.data) {
      push('/internal/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)])

  return (
    <div className="flex flex-col  space-y-4 overflow-hidden">
      <div className="text-2xl font-bold">Logging you in...</div>
      <div className="text-lg">{isPending ? 'Please wait...' : ''}</div>
      {data?.error && <div className="text-red-500 text-lg">{data?.error}</div>}
    </div>
  )
}

'use client'

import { useAuth } from '@/cms/providers/Auth'
import { User } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Message } from './Message'

export default function CMSPage() {
  const searchParams = useSearchParams()

  /* const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : ""; */

  const { externalLogin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const onSubmit = useCallback(
    async (data: Partial<User> & { businessId: string; isAdmin: boolean }) => {
      try {
        const tryLoginData = await externalLogin(getClientSideURL(), data)

        if (tryLoginData) {
          //Login success
          console.log('loging tryLoginData', tryLoginData)
          return router.push(`/cms/admin`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.log('Logging user in failed creating')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        console.log('loging data', data)
        await externalLogin(getClientSideURL(), data)
        clearTimeout(timer)
        if (redirect) {
          router.push(redirect)
        } else {
          return router.push(`/cms/admin`)
        }
      } catch (error) {
        console.error(error)
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [externalLogin, router, searchParams],
  )

  useEffect(() => {
    onSubmit({
      email: 'manuel@gmail.com',
      name: 'manuel',
      password: 'manuel@gmail.com',
      roles: ['super-admin', 'user'],
      businessId: '2',
      isAdmin: true,
    })
  }, [])

  return (
    <div>
      <h1>CMS</h1>
      <Message error={error} />
      {loading && <p>Loading...</p>}
    </div>
  )
}

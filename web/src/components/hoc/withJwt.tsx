import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface WithJwtProps {
  jwt: string
}

// HOC implementation
export const withJwt = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithJwtProps>,
) => {
  return async function WithJwtComponent(props: Omit<P, keyof WithJwtProps>) {
    try {
      const cookieStore = await cookies()
      const jwt = cookieStore.get('jwt')?.value

      if (!jwt) {
        redirect('/auth/login')
      }

      return <WrappedComponent {...(props as P)} jwt={jwt} />
    } catch (error) {
      console.error('JWT HOC Error:', error)
      redirect('/auth/login')
    }
  }
}

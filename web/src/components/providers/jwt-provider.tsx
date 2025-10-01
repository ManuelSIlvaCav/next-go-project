'use client'

import React, { createContext, useContext, useState } from 'react'

export interface JwtUser {
  id: string
  name: string
  email: string
}

export interface JwtContext {
  jwt: string
  setJwt: (jwt: string) => void
  user: JwtUser | null
  setUser: (user: JwtUser | null) => void
}

const Context = createContext({} as JwtContext)

export default function JwtProvider({
  children,
  initialJwt,
}: {
  children: React.ReactNode
  initialJwt: string
}) {
  const [jwt, setJwt] = useState<string>(initialJwt)
  const [user, setUser] = useState<JwtUser | null>(null)

  return (
    <Context.Provider
      value={{
        jwt,
        setJwt,
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseJWT = () => JwtContext

export const useJwt: UseJWT = () => useContext(Context)

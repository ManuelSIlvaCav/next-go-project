'use client'

import React, { createContext, useContext, useState } from 'react'

export interface JwtContext {
  jwt: string
  setJwt: (jwt: string) => void
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

  return (
    <Context.Provider
      value={{
        jwt,
        setJwt,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseJWT = () => JwtContext

export const useJwt: UseJWT = () => useContext(Context)

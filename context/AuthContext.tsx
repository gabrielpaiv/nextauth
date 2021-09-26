import Router from 'next/router'
import { setCookie } from 'nookies'
import { createContext, ReactNode, useState } from 'react'
import { api } from '../services/api'

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  user: User
}

type AuthProviderProps = {
  children: ReactNode
}

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null)
  const isAuthenticated = !!user
  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })
      const { permissions, roles, token, refreshToken } = response.data
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setCookie(undefined, 'nextauth.token', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      setUser({
        email,
        permissions,
        roles
      })
      Router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}


export const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH || 'http://localhost:8080'

export interface RegisterClientParams {
  email: string
  password: string
  confirm_password: string
  business_id: number
}

export interface RegisterClientResponse {
  access_token: string
  expires_at: string
  client: {
    id: string
    email: string
    first_name: string
    last_name: string
    business_id: string
  }
}

export const registerClient = async (params: RegisterClientParams): Promise<RegisterClientResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/clients/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Registration failed')
  }

  const data: RegisterClientResponse = await response.json()

  return data
}

export interface LoginClientParams {
  email: string
  password: string
  business_id: number
}

export interface LoginClientResponse {
  access_token: string
  expires_at: string
  client: {
    id: string
    email: string
    first_name: string
    last_name: string
    business_id: number
  }
}

export const loginClient = async (params: LoginClientParams): Promise<LoginClientResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/auth/clients/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Login failed')
  }

  const data: LoginClientResponse = await response.json()

  return data
}

import { getCookie } from 'cookies-next'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH || 'http://localhost:8080'

export interface CreatePetParams {
  pet_name: string
  pet_type: string
  age: number
}

export interface Pet {
  id: string
  business_id: number
  client_id: string
  pet_name: string
  pet_type: string
  created_at: string
}

export interface CreatePetResponse {
  data: Pet
  message: string
}

export const createPet = async (params: CreatePetParams): Promise<CreatePetResponse> => {
  const token = getCookie('petza_access_token')
  
  if (!token) {
    throw new Error('Authentication token not found')
  }

  const response = await fetch(`${API_BASE_URL}/v1/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Pet creation failed')
  }

  const data: CreatePetResponse = await response.json()
  return data
}
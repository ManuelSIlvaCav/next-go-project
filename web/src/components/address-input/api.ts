import { v4 } from 'uuid'
import {
  AddressPlaceDetailsResponse,
  AddressValidationRequest,
  AddressValidationResponse,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
} from './types'

// This should be moved to environment variables in a real application
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:autocomplete'
const ADDRESS_VALIDATION_URL = 'https://addressvalidation.googleapis.com/v1:validateAddress'
const PLACES_DETAILS_URL = 'https://places.googleapis.com/v1/places'

/**
 * Generates a random session token for Google Places API
 * Session tokens help group related autocomplete requests to avoid charges for duplicate requests
 */
export const generateSessionToken = (): string => {
  return v4()
}

/**
 * Fetch autocomplete suggestions from Google Places API
 */
export const fetchPlaceSuggestions = async (
  request: PlaceAutocompleteRequest,
): Promise<PlaceAutocompleteResponse> => {
  try {
    const response = await fetch(PLACES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': '*',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.error?.message || 'Failed to fetch place suggestions'
      console.error('Error fetching place suggestions:', {
        errorMessage,
        errorData,
        payload: request,
      })
      throw new Error(errorMessage)
    }
    console.log('Place suggestions fetched successfully:', { request })
    return await response.json()
  } catch (error) {
    console.error('Error fetching place suggestions:', { error, payload: request })
    throw error
  }
}

/**
 * Validate an address using Google Address Validation API
 * Uses the same session token as autocomplete to optimize billing and accuracy
 */
export const validateAddress = async (
  request: AddressValidationRequest,
): Promise<AddressValidationResponse> => {
  try {
    const response = await fetch(ADDRESS_VALIDATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': '*',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.error?.message || 'Failed to validate address'
      console.error('Error validating address:', {
        errorMessage,
        errorData,
        payload: request,
      })
      throw new Error(errorMessage)
    }

    console.log('Address validated successfully:', { request })
    return await response.json()
  } catch (error) {
    console.error('Error validating address:', { error, payload: request })
    throw error
  }
}

/**
 * Validate an address using Google end request Places details
 * Uses the same session token as autocomplete to optimize billing and accuracy
 */
export const validateAddressPlaceID = async (
  placeId: string,
  sessionToken?: string,
): Promise<AddressPlaceDetailsResponse> => {
  try {
    const url =
      `${PLACES_DETAILS_URL}/${placeId}` + (sessionToken ? `?sessionToken=${sessionToken}` : '')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': '*',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.error?.message || 'Failed to validate address'
      console.error('Error validating placeID address:', {
        errorMessage,
        errorData,
        sessionToken,
        placeId,
      })
      throw new Error(errorMessage)
    }

    console.log('Address validated placeID successfully:', { sessionToken, placeId })
    return await response.json()
  } catch (error) {
    console.error('Error validating placeID address:', { sessionToken, placeId })
    throw error
  }
}

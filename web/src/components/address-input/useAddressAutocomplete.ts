import useDebounce from '@/hooks/useDebounce'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPlaceSuggestions, generateSessionToken } from './api'
import { PlaceAutocompleteResponse, SuggestionResult } from './types'

interface UseAddressAutocompleteOptions {
  debounceMs?: number
  minChars?: number
  languageCode?: string
  country?: string
  maxResults?: number
}

export function useAddressAutocomplete(
  inputValue: string,
  options: UseAddressAutocompleteOptions = {},
): {
  suggestions: SuggestionResult[]
  isLoading: boolean
  error: Error | null
  sessionToken: string
  regenerateSessionToken: () => void
} {
  const { debounceMs = 800, minChars = 3, languageCode = 'es', country = 'cl' } = options

  // Create a stable session token reference
  const sessionTokenRef = useRef<string>(generateSessionToken())
  const [input, setInput] = useState<string>('')

  const debouncedInput = useDebounce(input, debounceMs)

  // Set up debouncing for the input
  useEffect(() => {
    setInput(inputValue)
  }, [inputValue])

  // Regenerate the session token when component mounts
  useEffect(() => {
    sessionTokenRef.current = generateSessionToken()
  }, [])

  // Use React Query to fetch suggestions
  const queryResult: UseQueryResult<PlaceAutocompleteResponse> = useQuery({
    queryKey: ['placeSuggestions', debouncedInput, sessionTokenRef.current],
    queryFn: async () => {
      if (!debouncedInput || debouncedInput.length < minChars) {
        return { suggestions: [] }
      }

      return fetchPlaceSuggestions({
        input: debouncedInput,
        languageCode,
        sessionToken: sessionTokenRef.current,
        includedRegionCodes: [country],
        regionCode: country,
      })
    },
    enabled: debouncedInput.length >= minChars,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // When a place is selected, regenerate session token for a new search session
  const regenerateSessionToken = useCallback(() => {
    sessionTokenRef.current = generateSessionToken()
  }, [])

  return {
    suggestions: queryResult.data?.suggestions || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    sessionToken: sessionTokenRef.current,
    regenerateSessionToken,
  }
}

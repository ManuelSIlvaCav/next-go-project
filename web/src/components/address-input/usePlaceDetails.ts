import { useMutation } from '@tanstack/react-query'
import { validateAddressPlaceID } from './api'
import { AddressPlaceDetailsRequest, AddressPlaceDetailsResponse } from './types'

interface UsePlaceDetailsOptions {
  onSuccess?: (data: AddressPlaceDetailsResponse) => void
  onError?: (error: Error) => void
}

export function usePlaceDetails(options: UsePlaceDetailsOptions = {}) {
  const { onSuccess, onError } = options

  const mutation = useMutation({
    mutationFn: (request: AddressPlaceDetailsRequest) =>
      validateAddressPlaceID(request.placeId, request.sessionToken),
    onSuccess,
    onError,
  })

  const validateAddressPlaceId = (
    sessionToken: string,
    placeId: string,
  ): Promise<AddressPlaceDetailsResponse> => {
    return new Promise((resolve, reject) => {
      mutation.mutate(
        {
          sessionToken,
          placeId,
        },
        {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        },
      )
    })
  }

  return {
    validatePlaceDetails: validateAddressPlaceId,
    isValidating: mutation.isPending,
    error: mutation.error,
    validationPlaceDetailsResult: mutation.data,
    reset: mutation.reset,
  }
}

import { useMutation } from '@tanstack/react-query'
import { validateAddress } from './api'
import { AddressValidationRequest, AddressValidationResponse } from './types'

interface UseAddressValidationOptions {
  onSuccess?: (data: AddressValidationResponse) => void
  onError?: (error: Error) => void
}

export function useAddressValidation(options: UseAddressValidationOptions = {}) {
  const { onSuccess, onError } = options

  const mutation = useMutation({
    mutationFn: (request: AddressValidationRequest) => validateAddress(request),
    onSuccess,
    onError,
  })

  const validateAddressWithToken = (
    sessionToken: string,
    addressLines: string,
    regionCode?: string,
    languageCode?: string,
    enableUspsCass?: boolean,
  ): Promise<AddressValidationResponse> => {
    return new Promise((resolve, reject) => {
      mutation.mutate(
        {
          sessionToken,
          address: {
            addressLines,
          },
          regionCode,
          languageCode,
          enableUspsCass,
        },
        {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        },
      )
    })
  }

  return {
    validateAddress: validateAddressWithToken,
    isValidating: mutation.isPending,
    error: mutation.error,
    validationResult: mutation.data,
    reset: mutation.reset,
  }
}

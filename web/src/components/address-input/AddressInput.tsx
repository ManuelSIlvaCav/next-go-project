import { Input } from '@/components/ui/input'
import clsx from 'clsx'
import { Loader2, MapPinIcon } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { AddressPlaceDetailsResponse, AddressValidationResponse, SuggestionResult } from './types'
import { useAddressAutocomplete } from './useAddressAutocomplete'
import { useAddressValidation } from './useAddressValidation'
import { usePlaceDetails } from './usePlaceDetails'

export interface AddressInputProps {
  /** Callback when user selects an address from suggestions */
  onAddressSelect?: (address: SuggestionResult) => void
  /** Callback when address validation is completed */
  onAddressValidated?: (
    validationResult: AddressValidationResponse | AddressPlaceDetailsResponse,
  ) => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Additional CSS classes for the input */
  className?: string
  /** Country code to restrict suggestions (e.g., 'us', 'cl') */
  countryRestriction?: string
  /** Initial value for the input */
  defaultValue?: string
}

export interface AddressInputRef {
  /** Clears the input and selected address */
  clear: () => void
  /** Sets the input value programmatically */
  setValue: (value: string) => void
  /** Gets the current input value */
  getValue: () => string
  /** Validates the current selected address or a specified address */
  validateAddress: (address?: string) => void
  /** The latest validation result, if available */
  validationResult?: AddressValidationResponse
  /** Validates place details using the place ID */
  validatePlaceDetails: (placeId: string) => void
  validationPlaceDetailsResult?: AddressPlaceDetailsResponse
}

export const AddressInput = forwardRef<AddressInputRef, AddressInputProps>(
  (
    {
      onAddressSelect,
      onAddressValidated,
      placeholder = 'Enter an address',
      className = '',
      countryRestriction = 'cl',
      defaultValue = '',
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(defaultValue)
    const [selectedAddress, setSelectedAddress] = useState<SuggestionResult | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const { suggestions, isLoading, sessionToken } = useAddressAutocomplete(inputValue, {
      country: countryRestriction,
    })

    const {
      validateAddress: validateAddressWithToken,
      validationResult,
      isValidating,
    } = useAddressValidation()

    const validateAddress = (address?: string) => {
      const addressToValidate =
        address || selectedAddress?.placePrediction?.text?.text || inputValue

      if (!addressToValidate) return

      validateAddressWithToken(
        sessionToken,
        addressToValidate,
        countryRestriction,
        undefined,
        undefined,
      )
        .then((data) => {
          if (onAddressValidated) {
            onAddressValidated(data)
          }
        })
        .catch((error: Error) => {
          console.error('Address validation failed:', error)
        })
    }

    const {
      validatePlaceDetails: validatePlaceDetailsWithToken,
      validationPlaceDetailsResult,
      isValidating: isValidatingPlaceDetails,
    } = usePlaceDetails()

    const validatePlaceDetails = (placeId: string) => {
      if (!placeId) return

      // Call the validation function with the place ID
      validatePlaceDetailsWithToken(sessionToken, placeId)
        .then((data) => {
          if (onAddressValidated) {
            onAddressValidated(data)
          }
        })
        .catch((error: Error) => {
          console.error('Place details validation failed:', error)
        })
    }

    useImperativeHandle(ref, () => ({
      clear: () => {
        setInputValue('')
        setSelectedAddress(null)
      },
      setValue: (value: string) => {
        setInputValue(value)
      },
      getValue: () => inputValue,
      validateAddress,
      validationResult,
      validatePlaceDetails,
      validationPlaceDetailsResult,
    }))

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (value.length >= 3) {
        setIsDropdownOpen(true)
      }
      setInputValue(value)
    }

    const handleSelectSuggestion = (suggestion: SuggestionResult) => {
      try {
        setSelectedAddress(suggestion)
        setInputValue(suggestion.placePrediction?.text?.text || '')

        if (onAddressSelect) {
          onAddressSelect(suggestion)
        }

        setIsDropdownOpen(false)
      } catch (error) {
        console.error('Error selecting address:', error)
      }
    }

    return (
      <div className={clsx('relative w-full', className)}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            className={`font-fredoka flex w-full rounded-md border px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>

        {suggestions.length > 0 && isDropdownOpen && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="flex items-center">
                  <span className="ml-3 truncate  font-latto text-black">
                    {suggestion.placePrediction?.text?.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {(isValidating || isValidatingPlaceDetails) && (
          <div className="mt-2 text-sm text-blue-500 flex items-center">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            <span>Validating address...</span>
          </div>
        )}
      </div>
    )
  },
)

AddressInput.displayName = 'AddressInput'

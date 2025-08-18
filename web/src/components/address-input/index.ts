import type { AddressInputProps, AddressInputRef } from './AddressInput'
import { AddressInput } from './AddressInput'
import type {
  AddressComponent,
  AddressValidationRequest,
  AddressValidationResponse,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  PlacePrediction,
  QueryPrediction,
  SuggestionResult,
  TextMatch,
  TextWithMatches,
} from './types'
import { useAddressAutocomplete } from './useAddressAutocomplete'
import { useAddressValidation } from './useAddressValidation'

export { AddressInput, useAddressAutocomplete, useAddressValidation }

export type {
  AddressComponent,
  AddressInputProps,
  AddressInputRef,
  AddressValidationRequest,
  AddressValidationResponse,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  PlacePrediction,
  QueryPrediction,
  SuggestionResult,
  TextMatch,
  TextWithMatches,
}

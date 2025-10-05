import clsx from 'clsx'
import { useRef, useState } from 'react'
import type { AddressInputRef } from './AddressInput'
import { AddressInput } from './AddressInput'
import { AddressPlaceDetailsResponse, AddressValidationResponse, SuggestionResult } from './types'

type AddressInputProps = {
  className?: string
  label?: string
}

export default function AddressField(props: AddressInputProps) {
  const [selectedAddress, setSelectedAddress] = useState<SuggestionResult | null>(null)
  const [, setValidationResult] = useState<
    AddressValidationResponse | AddressPlaceDetailsResponse | null
  >(null)
  const addressInputRef = useRef<AddressInputRef>(null)

  const handleAddressSelect = (address: SuggestionResult) => {
    setSelectedAddress(address)
    setValidationResult(null)
    console.log('Selected address:', address)
  }

  const handleAddressValidated = (
    result: AddressValidationResponse | AddressPlaceDetailsResponse,
  ) => {
    setValidationResult(result)
    console.log('Validation result:', result)
  }

  /* const handleValidateAddress = () => {
    if (addressInputRef.current) {
      addressInputRef.current.validateAddress()
    }
  } */

  /* const handlePlaceDetailsAddress = () => {
    if (addressInputRef.current) {
      addressInputRef.current.validatePlaceDetails(selectedAddress?.placePrediction?.placeId ?? '')
    }
  }

  const handleClearAddress = () => {
    if (addressInputRef.current) {
      addressInputRef.current.clear()
      setSelectedAddress(null)
      setValidationResult(null)
    }
  } */

  /* const ValidationResultComponent = () => {
    if (!validationResult) return null
    if ('id' in validationResult) {
      return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Place Details Result:</h3>
          <p>{validationResult.id}</p>
          <p>{validationResult.displayName?.text}</p>
          <p>{validationResult.businessStatus}</p>
        </div>
      )
    }
    if ('result' in validationResult) {
      return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Validation Result:</h3>

          <div className="mb-2">
            <strong>Formatted Address:</strong> {validationResult.result.address.formattedAddress}
          </div>

          <div className="mb-2">
            <strong>Verdict:</strong>{' '}
            <span
              className={
                validationResult.result.verdict.validationGranularity === 'PREMISE_LEVEL'
                  ? 'text-green-600 font-bold'
                  : 'text-amber-600'
              }
            >
              {validationResult.result.verdict.validationGranularity}
            </span>
          </div>

          {validationResult.result.verdict.hasInferredComponents && (
            <div className="text-amber-600 mb-2">
              <strong>Note:</strong> Some parts of the address were inferred
            </div>
          )}

          {validationResult.result.address.addressComponents && (
            <div className="mt-4">
              <strong>Address Components:</strong>
              <ul className="list-disc pl-5 mt-1">
                {validationResult.result.address.addressComponents.map((component, idx) => (
                  <li
                    key={idx}
                    className={
                      component.confirmationLevel === 'CONFIRMED'
                        ? 'text-green-600'
                        : 'text-amber-600'
                    }
                  >
                    {component.componentType}: {component.componentName.text}
                    {component.inferred && ' (inferred)'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.result.geocode && (
            <div className="mt-4">
              <strong>Location:</strong> {validationResult.result.geocode.location.latitude},{' '}
              {validationResult.result.geocode.location.longitude}
            </div>
          )}
        </div>
      )
    }
    return null
  } */

  console.log('Rendering AddressField with props:', { selectedAddress })
  return (
    <div className={clsx('space-y-2', props.className)}>
      {props.label && (
        <label className="font-latto text-sm font-medium text-gray-700 dark:text-gray-200 block">
          {props.label}
        </label>
      )}
      <AddressInput
        className=""
        ref={addressInputRef}
        onAddressSelect={handleAddressSelect}
        onAddressValidated={handleAddressValidated}
        placeholder="Enter an address"
        countryRestriction={'cl'} // Updated to CL for better validation results
      />

      {/* {selectedAddress && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Selected Address:</h3>
          <p className="mb-1">{selectedAddress.placePrediction?.text.text}</p>
        </div>
      )} */}
    </div>
  )
}

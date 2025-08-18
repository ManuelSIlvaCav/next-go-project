export interface PlaceAutocompleteResponse {
  suggestions: SuggestionResult[]
}

export interface SuggestionResult {
  placePrediction?: PlacePrediction
  queryPrediction?: QueryPrediction
}

export interface PlacePrediction {
  place: string
  placeId: string
  text: TextWithMatches
  structuredFormat?: {
    mainText: TextWithMatches
    secondaryText: {
      text: string
    }
  }
  types?: string[]
}

export interface QueryPrediction {
  text: TextWithMatches
}

export interface TextWithMatches {
  text: string
  matches?: TextMatch[]
}

export interface TextMatch {
  startOffset?: number
  endOffset: number
}

// Address Validation Interfaces
export interface AddressValidationRequest {
  sessionToken: string
  address: {
    addressLines: string
  }
  enableUspsCass?: boolean
  regionCode?: string
  languageCode?: string
}

export interface AddressValidationResponse {
  result: {
    verdict: {
      inputGranularity: string
      validationGranularity: string
      geocodeGranularity: string
      hasInferredComponents: boolean
    }
    address: {
      formattedAddress: string
      postalAddress?: {
        regionCode: string
        languageCode: string
        postalCode: string
        administrativeArea: string
        locality: string
        addressLines: string[]
      }
      addressComponents: AddressComponent[]
      missingComponentTypes?: string[]
    }
    geocode?: {
      location: {
        latitude: number
        longitude: number
      }
      plusCode?: {
        globalCode: string
      }
      bounds?: {
        low: {
          latitude: number
          longitude: number
        }
        high: {
          latitude: number
          longitude: number
        }
      }
      featureSizeMeters?: number
      placeId: string
      placeTypes?: string[]
    }
    uspsData?: {
      standardizedAddress?: {
        firstAddressLine?: string
        secondAddressLine?: string
        cityStateZipAddressLine?: string
        city?: string
        state?: string
        zipCode?: string
      }
      dpvFootnote?: string
      postOfficeCity?: string
      postOfficeState?: string
    }
  }
  responseId: string
}

export interface AddressComponent {
  componentName: {
    text: string
    languageCode?: string
  }
  componentType: string
  confirmationLevel: 'CONFIRMED' | 'UNCONFIRMED'
  inferred?: boolean
}

export interface PlaceAutocompleteRequest {
  input: string
  sessionToken?: string
  languageCode?: string
  regionCode?: string
  includeQueryPredictions?: boolean
  includedRegionCodes?: string[]
  origin?: {
    latitude: number
    longitude: number
  }
  locationRestriction?: {
    circle?: {
      center: {
        latitude: number
        longitude: number
      }
      radius: number
    }
    rectangle?: {
      low: {
        latitude: number
        longitude: number
      }
      high: {
        latitude: number
        longitude: number
      }
    }
  }
}

export interface AddressPlaceDetailsRequest {
  sessionToken?: string
  placeId: string
}

export interface AddressPlaceDetailsResponse {
  id: string
  businessStatus?: string
  displayName: {
    text: string
    languageCode?: string
  }
  accessibilityOptions?: {
    wheelchairAccessibleParking?: boolean
    wheelchairAccessibleEntrance?: boolean
  }
}

import type { PlacesDetailResponse } from '../types'
import { getApiKey } from './key'

export async function handleGeocode(address: string) {
  const url = new URL('https://api.nextbillion.io/geocode')
  url.searchParams.append('q', address)
  url.searchParams.append('key', getApiKey())

  const response = await fetch(url.toString())
  const data = (await response.json()) as PlacesDetailResponse

  return _generatePlaceDetailResult(data)
}

export async function handleReverseGeocode(latitude: number, longitude: number) {
  const url = new URL('https://api.nextbillion.io/revgeocode')
  url.searchParams.append('at', `${latitude},${longitude}`)
  url.searchParams.append('key', getApiKey())

  const response = await fetch(url.toString())
  const data = (await response.json()) as PlacesDetailResponse

  return _generatePlaceDetailResult(data)
}

export async function handlePlaceSearch(
  query: string,
  location?: { latitude: number; longitude: number },
  radius?: number,
) {
  const url = new URL('https://api.nextbillion.io/discover')
  url.searchParams.append('q', query)
  url.searchParams.append('key', getApiKey())

  if (location) {
    url.searchParams.append('at', `${location.latitude},${location.longitude}`)

    if (radius) {
      url.searchParams.append('in', `circle:${location.latitude},${location.longitude};r=${radius}`)
    }
  }

  const response = await fetch(url.toString())
  const data = (await response.json()) as PlacesDetailResponse

  return _generatePlaceDetailResult(data)
}

export async function handlePlaceDetails(place_id: string) {
  const url = new URL('https://api.nextbillion.io/lookup')
  url.searchParams.append('id', place_id)
  url.searchParams.append('key', getApiKey())

  const response = await fetch(url.toString())
  const data = (await response.json()) as PlacesDetailResponse

  return _generatePlaceDetailResult(data)
}

async function _generatePlaceDetailResult(data: PlacesDetailResponse) {
  if (data.title !== undefined || (data.status && Number.isInteger(data.status) && Number(data.status) >= 400)) {
    return {
      content: [
        {
          type: 'text',
          text: `Geocoding failed: ${data.title}, status code: ${data.status}`,
        },
      ],
      isError: true,
    }
  }

  const item = data.items[0]

  if (!item) {
    return {
      content: [
        {
          type: 'text',
          text: 'No place results found',
        },
      ],
      isError: true,
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          id: item.id,
          location: {
            latitude: item.position.lat,
            longitude: item.position.lng,
          },
          title: item.title,
          formatted_address: item.address.label,
          postal_code: item.address.postalCode,
          categories: item.categories.map((category) => category.name),
          contact: item.contacts?.[0]?.phone?.[0]?.value || null,
        }),
      },
    ],
    isError: false,
  }
}

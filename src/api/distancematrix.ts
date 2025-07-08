import type { DistanceMatrixRequest, DistanceMatrixResponse } from '../types'
import { getApiKey } from './key'

export async function handleDistanceMatrix(request: DistanceMatrixRequest) {
  const url = new URL('https://api.nextbillion.io/distancematrix/json')
  url.searchParams.append('option', 'flexible')
  url.searchParams.append('origins', request.origins.join('|'))
  url.searchParams.append('destinations', request.destinations.join('|'))
  url.searchParams.append('mode', request.mode || 'car')
  url.searchParams.append('key', getApiKey())

  if (request.bearings) {
    url.searchParams.append(
      'bearings',
      request.bearings.map((bearing) => `${bearing.degree},${bearing.range}`).join('|'),
    )
  }

  if (request.approaches) {
    url.searchParams.append('approaches', request.approaches)
  }

  if (request.cross_border !== undefined) {
    url.searchParams.append('cross_border', request.cross_border ? 'true' : 'false')
  }

  if (request.departure_time !== undefined) {
    url.searchParams.append('departure_time', request.departure_time.toString())
  }

  if (request.avoid) {
    url.searchParams.append('avoid', request.avoid)
  }

  if (request.exclude) {
    url.searchParams.append('exclude', request.exclude)
  }

  if (request.route_type) {
    url.searchParams.append('route_type', request.route_type)
  }

  if (request.hazmat_type) {
    url.searchParams.append('hazmat_type', request.hazmat_type)
  }

  if (request.turn_angle_range !== undefined) {
    url.searchParams.append('turn_angle_range', request.turn_angle_range.toString())
  }

  if (request.truck_size) {
    url.searchParams.append('truck_size', request.truck_size)
  }

  if (request.truck_weight !== undefined) {
    url.searchParams.append('truck_weight', request.truck_weight.toString())
  }

  if (request.truck_axle_load !== undefined) {
    url.searchParams.append('truck_axle_load', request.truck_axle_load.toString())
  }

  const response = await fetch(url.toString())
  const data = (await response.json()) as DistanceMatrixResponse

  if (data.msg !== undefined || (data.status && Number.isInteger(data.status) && Number(data.status) >= 400)) {
    return {
      content: [
        {
          type: 'text',
          text: `Distance matrix request failed: ${data.msg || data.status}`,
        },
      ],
      isError: true,
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            results: data.rows.map((row) => ({
              elements: row.elements.map((element) => ({
                duration: element.duration.value,
                distance: element.distance.value,
              })),
            })),
          },
          null,
          2,
        ),
      },
    ],
    isError: false,
  }
}

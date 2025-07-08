import type { DirectionsRequest, DirectionsResponse, NavigationResponse } from '../types'
import { getApiKey } from './key'

export async function handleNavigation(request: DirectionsRequest) {
  const url = new URL('https://api.nextbillion.io/navigation')
  url.searchParams.append('option', 'flexible')
  url.searchParams.append('origin', request.origin)
  url.searchParams.append('destination', request.destination)
  url.searchParams.append('mode', request.mode || 'car')
  url.searchParams.append('key', getApiKey())

  if (request.waypoints) {
    url.searchParams.append('waypoints', request.waypoints.join('|'))
  }

  if (request.geometry) {
    url.searchParams.append('geometry', request.geometry)
  }

  if (request.avoid) {
    url.searchParams.append('avoid', request.avoid)
  }

  if (request.exclude) {
    url.searchParams.append('exclude', request.exclude)
  }

  if (request.approaches) {
    url.searchParams.append('approaches', request.approaches)
  }

  if (request.bearings) {
    url.searchParams.append(
      'bearings',
      request.bearings.map((bearing) => `${bearing.degree},${bearing.range}`).join('|'),
    )
  }

  if (request.departure_time !== undefined) {
    url.searchParams.append('departure_time', request.departure_time.toString())
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

  if (request.route_type) {
    url.searchParams.append('route_type', request.route_type)
  }

  if (request.hazmat_type) {
    url.searchParams.append('hazmat_type', request.hazmat_type)
  }

  if (request.turn_angle_range !== undefined) {
    url.searchParams.append('turn_angle_range', request.turn_angle_range.toString())
  }

  if (request.alternatives !== undefined) {
    url.searchParams.append('alternatives', request.alternatives ? 'true' : 'false')
  }

  if (request.altcount !== undefined) {
    url.searchParams.append('altcount', request.altcount.toString())
  }

  if (request.road_info) {
    url.searchParams.append('road_info', request.road_info)
  }

  if (request.drive_time_limits) {
    url.searchParams.append('drive_time_limits', request.drive_time_limits.map((limit) => limit.toString()).join(','))
  }

  if (request.rest_times) {
    url.searchParams.append('rest_times', request.rest_times.map((time) => time.toString()).join(','))
  }

  const response = await fetch(url.toString())
  const data = (await response.json()) as NavigationResponse

  if (data.msg !== undefined || (data.status && Number.isInteger(data.status) && Number(data.status) >= 400)) {
    return {
      content: [
        {
          type: 'text',
          text: `Directions request failed: ${data.msg || data.status}`,
        },
      ],
      isError: true,
    }
  }

  if (!data.routes || !data.routes.length) {
    return {
      content: [
        {
          type: 'text',
          text: 'No routes found',
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
            routes: data.routes.map((route) => ({
              distance: route.distance,
              duration: route.duration,
              steps: route.legs.map((leg) => ({
                distance: leg.distance,
                duration: leg.duration,
                steps: leg.steps.map((step) => ({
                  distance: step.distance,
                  duration: step.duration,
                  maneuver: {
                    instruction: step.maneuver.instruction,
                    maneuver_type: step.maneuver.maneuver_type,
                    modifier: step.maneuver.modifier,
                  },
                })),
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

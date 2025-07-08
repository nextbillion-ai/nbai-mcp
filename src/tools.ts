import type { Tool } from '@modelcontextprotocol/sdk/types.js'

const GEOCODE_TOOL: Tool = {
  name: 'geocode',
  description:
    'Convert an address into geographic coordinates. You should prefer search_places over geocode when the address is not well formatted and might be ambiguous.',
  inputSchema: {
    type: 'object',
    properties: {
      address: {
        type: 'string',
        description: 'The address to geocode',
      },
    },
    required: ['address'],
  },
}

const REVERSE_GEOCODE_TOOL: Tool = {
  name: 'reverse_geocode',
  description: 'Convert coordinates into an address',
  inputSchema: {
    type: 'object',
    properties: {
      latitude: {
        type: 'number',
        description: 'Latitude coordinate',
      },
      longitude: {
        type: 'number',
        description: 'Longitude coordinate',
      },
    },
    required: ['latitude', 'longitude'],
  },
}

const SEARCH_PLACES_TOOL: Tool = {
  name: 'search_places',
  description:
    'Search for places using NBAI Places API. You should prefer search_places over geocode when the address is not well formatted and might be ambiguous. You can make multiple calls for getting locations for more than one place.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
      location: {
        type: 'object',
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
        description: 'Optional center point for the search',
      },
      radius: {
        type: 'number',
        description: 'Search radius in meters (max 50000)',
      },
    },
    required: ['query'],
  },
}

const PLACE_DETAILS_TOOL: Tool = {
  name: 'place_details',
  description: 'Get detailed information about a specific place. You can get the place ID from the search_places tool.',
  inputSchema: {
    type: 'object',
    properties: {
      place_id: {
        type: 'string',
        description: 'The place ID to get details for',
      },
    },
    required: ['place_id'],
  },
}

const DISTANCE_MATRIX_TOOL: Tool = {
  name: 'distance_matrix',
  description:
    'Calculate travel distance and time for multiple origins and destinations using NextBillion.ai API. You should prefer distance_matrix over directions when you need to get travel distance and time for multiple origins and destinations in one request. Distance Matrix does not provide turn-by-turn instructions.',
  inputSchema: {
    type: 'object',
    properties: {
      origins: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of origin coordinates. Ensure that origins are routable land locations.',
      },
      destinations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of destination coordinates. Ensure that destinations are routable land locations.',
      },
      mode: {
        type: 'string',
        description: 'Travel mode: car or truck. When mode=truck, default dimensions are used unless specified.',
        enum: ['car', 'truck'],
        default: 'car',
      },
      departure_time: {
        type: 'number',
        description: 'Departure time as UNIX timestamp in seconds. Used for traffic-based routing.',
      },
      avoid: {
        type: 'string',
        description: 'Objects to avoid during routing (flexible filter)',
        enum: [
          'toll',
          'ferry',
          'highway',
          'service_road',
          'uturn',
          'sharp_turn',
          'left_turn',
          'right_turn',
          'bbox',
          'geofence_id',
          'tunnel',
          'none',
        ],
      },
      exclude: {
        type: 'string',
        description: 'Objects to strictly exclude during routing (mandatory filter)',
        enum: ['toll', 'ferry', 'highway', 'service_road', 'uturn', 'sharp_turn', 'left_turn', 'right_turn', 'none'],
      },
      approaches: {
        type: 'string',
        description:
          'Semicolon-separated list indicating the side of the road from which the route will approach destinations',
      },
      bearings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            degree: { type: 'number', description: 'Bearing angle in degrees (0-360)' },
            range: { type: 'number', description: 'Acceptable range around the bearing' },
          },
          required: ['degree', 'range'],
        },
        description: 'Array of bearing constraints for origins and destinations',
      },
      cross_border: {
        type: 'boolean',
        description: 'Allow routes crossing international borders (North America only)',
      },
      truck_size: {
        type: 'string',
        description: 'Truck dimensions in cm format: height,width,length (effective only when mode=truck)',
      },
      truck_weight: {
        type: 'number',
        description: 'Truck weight in kg including trailers and goods (effective only when mode=truck)',
      },
      truck_axle_load: {
        type: 'number',
        description: 'Total load per axle in tonnes (effective only when mode=truck)',
      },
      route_type: {
        type: 'string',
        description: 'Route type to be returned',
        enum: ['fastest', 'shortest'],
      },
      hazmat_type: {
        type: 'string',
        description: 'Type of hazardous materials (effective only when mode=truck)',
        enum: ['general', 'circumstantial', 'explosive', 'harmful_to_water'],
      },
      turn_angle_range: {
        type: 'number',
        description: 'Turn angle range in degrees (effective only when avoid=sharp_turn)',
      },
    },
    required: ['origins', 'destinations'],
  },
}

const DIRECTIONS_TOOL: Tool = {
  name: 'directions',
  description:
    'Get directions between two points using NextBillion.ai API. You should prefer navigation over directions when you need to get turn-by-turn instructions or answering questions about the route.',
  inputSchema: {
    type: 'object',
    properties: {
      origin: {
        type: 'string',
        description: 'Starting point coordinates',
      },
      destination: {
        type: 'string',
        description: 'Ending point coordinates',
      },
      mode: {
        type: 'string',
        description: 'Travel mode: car or truck. When mode=truck, default dimensions are used unless specified.',
        enum: ['car', 'truck'],
        default: 'car',
      },
      waypoints: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of waypoint coordinates along the route (max 50 waypoints)',
      },
      geometry: {
        type: 'string',
        description: 'Output format of the route geometry',
        enum: ['polyline', 'polyline6'],
      },
      avoid: {
        type: 'string',
        description: 'Objects to avoid during routing (flexible filter)',
        enum: [
          'toll',
          'ferry',
          'highway',
          'service_road',
          'uturn',
          'sharp_turn',
          'left_turn',
          'right_turn',
          'bbox',
          'genfence_id',
          'tunnel',
          'none',
        ],
      },
      exclude: {
        type: 'string',
        description: 'Objects to strictly exclude during routing (mandatory filter)',
        enum: ['toll', 'ferry', 'highway', 'service_road', 'uturn', 'sharp_turn', 'left_turn', 'right_turn', 'none'],
      },
      approaches: {
        type: 'string',
        description: 'Side of the road from which to approach waypoints',
        enum: ['unrestricted', 'curb'],
      },
      bearings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            degree: { type: 'number', description: 'Bearing angle in degrees (0-360)' },
            range: { type: 'number', description: 'Acceptable range around the bearing' },
          },
          required: ['degree', 'range'],
        },
        description: 'Array of bearing constraints for origins and destinations',
      },
      departure_time: {
        type: 'number',
        description: 'Departure time as UNIX timestamp in seconds. Used for traffic-based routing.',
      },
      truck_size: {
        type: 'string',
        description: 'Truck dimensions in cm format: height,width,length (effective only when mode=truck)',
      },
      truck_weight: {
        type: 'number',
        description: 'Truck weight in kg including trailers and goods (effective only when mode=truck)',
      },
      truck_axle_load: {
        type: 'number',
        description: 'Total load per axle in tonnes (effective only when mode=truck)',
      },
      route_type: {
        type: 'string',
        description: 'Route type to be returned',
        enum: ['fastest', 'shortest'],
      },
      alternatives: {
        type: 'boolean',
        description: 'Return alternate routes (effective only with no waypoints and route_type=shortest)',
      },
      altcount: {
        type: 'number',
        description: 'Number of alternative routes to return (effective only when alternatives=true)',
      },
      road_info: {
        type: 'string',
        description: 'Additional road segment information',
        enum: ['max_speed', 'toll_distance', 'toll_cost'],
      },
      cross_border: {
        type: 'boolean',
        description: 'Allow routes crossing international borders (North America only)',
      },
      hazmat_type: {
        type: 'string',
        description: 'Type of hazardous materials (effective only when mode=truck)',
        enum: ['general', 'circumstantial', 'explosive', 'harmful_to_water'],
      },
      turn_angle_range: {
        type: 'number',
        description: 'Turn angle range in degrees (effective only when avoid=sharp_turn)',
      },
      drive_time_limits: {
        type: 'array',
        items: { type: 'number' },
        description: 'Array of driving durations in seconds before rest periods',
      },
      rest_times: {
        type: 'array',
        items: { type: 'number' },
        description: 'Array of rest durations in seconds after driving periods',
      },
    },
    required: ['origin', 'destination'],
  },
}

const NAVIGATION_TOOL: Tool = {
  name: 'navigation',
  description:
    'Get turn-by-turn navigation between two points using NextBillion.ai API. You should prefer navigation over directions when you need to get turn-by-turn instructions or answering questions about the route.',
  inputSchema: {
    type: 'object',
    properties: {
      origin: {
        type: 'string',
        description: 'Starting point coordinates',
      },
      destination: {
        type: 'string',
        description: 'Ending point coordinates',
      },
      mode: {
        type: 'string',
        description: 'Travel mode: car or truck. When mode=truck, default dimensions are used unless specified.',
        enum: ['car', 'truck'],
        default: 'car',
      },
      waypoints: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of waypoint coordinates along the route (max 50 waypoints)',
      },
      geometry: {
        type: 'string',
        description: 'Output format of the route geometry',
        enum: ['polyline', 'polyline6'],
      },
      avoid: {
        type: 'string',
        description: 'Objects to avoid during routing (flexible filter)',
        enum: [
          'toll',
          'ferry',
          'highway',
          'service_road',
          'uturn',
          'sharp_turn',
          'left_turn',
          'right_turn',
          'bbox',
          'geofence_id',
          'tunnel',
          'none',
        ],
      },
      exclude: {
        type: 'string',
        description: 'Objects to strictly exclude during routing (mandatory filter)',
        enum: ['toll', 'ferry', 'highway', 'service_road', 'uturn', 'sharp_turn', 'left_turn', 'right_turn', 'none'],
      },
      approaches: {
        type: 'string',
        description: 'Side of the road from which to approach waypoints',
        enum: ['unrestricted', 'curb'],
      },
      bearings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            degree: { type: 'number', description: 'Bearing angle in degrees (0-360)' },
            range: { type: 'number', description: 'Acceptable range around the bearing' },
          },
          required: ['degree', 'range'],
        },
        description: 'Array of bearing constraints for origins and destinations',
      },
      departure_time: {
        type: 'number',
        description: 'Departure time as UNIX timestamp in seconds. Used for traffic-based routing.',
      },
      truck_size: {
        type: 'string',
        description: 'Truck dimensions in cm format: height,width,length (effective only when mode=truck)',
      },
      truck_weight: {
        type: 'number',
        description: 'Truck weight in kg including trailers and goods (effective only when mode=truck)',
      },
      truck_axle_load: {
        type: 'number',
        description: 'Total load per axle in tonnes (effective only when mode=truck)',
      },
      route_type: {
        type: 'string',
        description: 'Route type to be returned',
        enum: ['fastest', 'shortest'],
      },
      alternatives: {
        type: 'boolean',
        description: 'Return alternate routes (effective only with no waypoints and route_type=shortest)',
      },
      altcount: {
        type: 'number',
        description: 'Number of alternative routes to return (effective only when alternatives=true)',
      },
      road_info: {
        type: 'string',
        description: 'Additional road segment information',
        enum: ['max_speed', 'toll_distance', 'toll_cost'],
      },
      cross_border: {
        type: 'boolean',
        description: 'Allow routes crossing international borders (North America only)',
      },
      hazmat_type: {
        type: 'string',
        description: 'Type of hazardous materials (effective only when mode=truck)',
        enum: ['general', 'circumstantial', 'explosive', 'harmful_to_water'],
      },
      turn_angle_range: {
        type: 'number',
        description: 'Turn angle range in degrees (effective only when avoid=sharp_turn)',
      },
      drive_time_limits: {
        type: 'array',
        items: { type: 'number' },
        description: 'Array of driving durations in seconds before rest periods',
      },
      rest_times: {
        type: 'array',
        items: { type: 'number' },
        description: 'Array of rest durations in seconds after driving periods',
      },
    },
    required: ['origin', 'destination'],
  },
}

export const TOOLS = [
  GEOCODE_TOOL,
  REVERSE_GEOCODE_TOOL,
  SEARCH_PLACES_TOOL,
  PLACE_DETAILS_TOOL,
  DISTANCE_MATRIX_TOOL,
  DIRECTIONS_TOOL,
  NAVIGATION_TOOL,
]

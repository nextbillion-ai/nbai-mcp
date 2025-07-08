// Request interfaces
export interface DistanceMatrixRequest {
  // origins are the starting point of your route. Ensure that origins are routable land locations. Multiple origins should be separated by a pipe symbol (|).
  origins: string[]
  // destinations are the ending coordinates of your route. Ensure that destinations are routable land locations. Multiple destinations should be separated by a pipe symbol (|)
  destinations: string[]
  /*
  Set which driving mode the service should use to determine the distance and duration values.

  For example, if you use car, the API will return the duration and distance of a route that a car can take. Using truck will return the same for a route a truck can use, taking into account appropriate truck routing restrictions.

  When mode=truck, following are the default dimensions that are used:

  truck_height = 214 centimeters
  truck_width = 183 centimeters
  truck_length = 519 centimeters
  truck_weight = 5000 kg

  If you want to specify custom truck dimensions, please use truck_weight and truck_size parameters.

  [Note: Only the car profile is enabled by default. Please note that customized profiles (including truck) might not be available for all regions. Please contact your NextBillion.ai account manager, sales representative or reach out at support@nextbillion.ai in case you need additional profiles]
  */
  mode?: 'car' | 'truck'
  /*
  Use this parameter to set a departure time for your trip using a UNIX timestamp in seconds precision. The response will return a route based on typical traffic conditions at the given start time. If no input is provided for this parameter then the traffic conditions at the time of making the request are considered

  departure_time is ineffective when route_type is set to shortest as the service will return the shortest path possible irrespective of the traffic conditions.
  */
  departure_time?: number
  /*
  Set this parameter to find alternative routes that bypass specified objects. Use a pipe (`|`) to separate multiple values. This is a flexible filter; if no alternative routes exist, the service will still provide a route that includes the objects. For a strict filter, consider using the exclude parameter.

  Note:
  - This parameter is effective only when route_type=fastest.
  - Following objects are exceptions to the flexible filtering behavior of avoid parameter: bbox , tunnel and geofence_id . When used, the service will return a 4xx error in case there are no alternative routes available.
  - When using avoid=bbox users also need to specify the boundaries of the bounding box to be avoided. Multiple bounding boxes can be specified simultaneously. The perimeter of a bounding box can not exceed 500 kms.
    - Format: bbox: min_latitude,min_longtitude,max_latitude,max_longitude.
    - Example: avoid=bbox: 34.0635,-118.2547, 34.0679,-118.2478 | bbox: 34.0521,-118.2342, 34.0478,-118.2437
  - When using avoid=sharp_turn, default range of permissible turn angles is [120,240]. In order to override default range, please use turn_angle_range parameter.
  - When using avoid=geofence_id , only the the geofences created using NextBillion.ai Geofence API are valid.
  - When this parameter is not provided in the input, ferry routes are set to be avoided by default. When this parameter is provided, only the mentioned object(s) are avoided.
  - If none is provided along with other values, an error is returned as a valid route is not feasible.
  */
  avoid?:
    | 'toll'
    | 'ferry'
    | 'highway'
    | 'service_road'
    | 'uturn'
    | 'sharp_turn'
    | 'left_turn'
    | 'right_turn'
    | 'bbox'
    | 'geofence_id'
    | 'tunnel'
    | 'none'
  /*
  This parameter serves as a mandatory filter, ensuring the service returns only those routes that strictly avoid the object(s) indicated. Multiple values should be separated by a pipe (`|`). If no routes can be found that exclude the specified object(s), the service will return a 4xx error. For a less strict filtering approach, consider using the avoid parameter.

  Note:
    - This parameter is effective only when route_type=fastest.
    - When using exclude=sharp_turn, default range of permissible turn angles is [120,240]. In order to override default range, please use turn_angle_range parameter.
    - If none is provided along with other values, an error is returned as a valid route is not feasible.
  */
  exclude?: 'toll' | 'ferry' | 'highway' | 'service_road' | 'uturn' | 'sharp_turn' | 'left_turn' | 'right_turn' | 'none'
  /*
  A semicolon-separated list indicating the side of the road from which the route will approach destinations.

  When set to unrestricted a route can arrive at a destination from either side of the road. When set to curb the route will arrive at a destination on the driving side of the region.

  Please note the number of values provided must be equal to the number of destinations. However, you can skip a coordinate and show its position in the list with the ; separator.

  The values provided for the approaches parameter are effective for the destinations value at the same index. Example: curb;;curb will apply curbside restriction on the destinations points provided at the first and third index.
  */
  approaches?: string
  /*
  Limits the search to segments with given bearing in degrees towards true north in clockwise direction. Each bearing should be in the format of degree,range, where the degree should be a value between [0, 360] and range should be a value between [0, 180].

  Please note that the number of bearings should be equal to the sum of the number of points in origins and destinations. If a route can approach a destination from any direction, the bearing for that point can be specified as "0,180".
  */
  bearings?: Array<{ degree: number; range: number }>
  /*
  Specify if crossing an international border is expected for operations near border areas. When set to false, the API will prohibit routes going back & forth between countries. Consequently, routes within the same country will be preferred if they are feasible for the given set of destination or waypoints . When set to true, the routes will be allowed to go back & forth between countries as needed.

  This feature is available in North America region only. Please get in touch with support@nextbillion.ai to enquire/enable other areas.
  */
  cross_border?: boolean
  /*
  This defines the dimensions of a truck in centimeters (cm). This parameter is effective only when the mode=truck. Maximum dimensions are as follows:
  Height = 1000 cm
  Width = 5000 cm
  Length = 5000 cm
  */
  truck_size?: string
  // This parameter defines the weight of the truck including trailers and shipped goods in kilograms (kg). This parameter is effective only when mode=truck.
  truck_weight?: number
  /*
  Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle.

  Please note this parameter is effective only when `mode=truck`.
  */
  truck_axle_load?: number
  // Set the route type that needs to be returned.
  route_type?: 'fastest' | 'shortest'
  /*
  Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator | .

  Please note that this parameter is effective only when mode=truck.
  */
  hazmat_type?: 'general' | 'circumstantial' | 'explosive' | 'harmful_to_water'
  /*
  Specify the turn angles that can be taken safely by the vehicle. The permissible turn angles are calculated as [0 + turn_angle_range , 360 - turn_angle_range]. Please note that this parameter is effective only when avoid = sharp_turn.

  It is worth highlighting here that providing smaller angles might lead to 4xx errors as route engine might not be able find routes satisfying the smaller turn angle criteria for all turns in the routes
  */
  turn_angle_range?: number // in degrees, [0 + turn_angle_range , 360 - turn_angle_range]
}

export interface DistanceMatrixResponse extends NbaiResponse {
  rows: Array<{
    elements: Array<{
      duration: {
        value: number
      }
      distance: {
        value: number
      }
    }>
  }>
}

export interface DirectionsRequest {
  origin: string
  destination: string
  /*
  Set which driving mode the service should use to determine the distance and duration values.

  For example, if you use car, the API will return the duration and distance of a route that a car can take. Using truck will return the same for a route a truck can use, taking into account appropriate truck routing restrictions.

  When mode=truck, following are the default dimensions that are used:

  truck_height = 214 centimeters
  truck_width = 183 centimeters
  truck_length = 519 centimeters
  truck_weight = 5000 kg

  If you want to specify custom truck dimensions, please use truck_weight and truck_size parameters.

  [Note: Only the car profile is enabled by default. Please note that customized profiles (including truck) might not be available for all regions. Please contact your NextBillion.ai account manager, sales representative or reach out at support@nextbillion.ai in case you need additional profiles]
  */
  mode?: 'car' | 'truck'
  /*
  waypoints are coordinates along the route between the origin and destination. It is a pipe-separated list of coordinate pairs. Please note that the route returned will arrive at the waypoints in the sequence they are provided in the input request.

  The maximum number of `waypoints` that can be added in a single request is 50.

  Format: latitude_1,longitude_1|latitude_2,longitude_2|...

  Example: waypoints=41.349302,2.136480|41.349303,2.136481|41.349304,2.136482
  */
  waypoints?: string[]
  /*
  Sets the output format of the route geometry in the response.

  On providing polyline and polyline6 as input, respective encoded geometry is returned.
  */
  geometry?: 'polyline' | 'polyline6'
  /*
  Set this parameter to find alternative routes that bypass specified objects. Use a pipe (`|`) to separate multiple values. This is a flexible filter; if no alternative routes exist, the service will still provide a route that includes the objects. For a strict filter, consider using the exclude parameter.

  Note:

  - This parameter is effective only when route_type=fastest.
  - Following objects are exceptions to the flexible filtering behavior of avoid parameter: bbox , tunnel and geofence_id . When used, the service will return a 4xx error in case there are no alternative routes available.
  - When using avoid=bbox users also need to specify the boundaries of the bounding box to be avoided. Multiple bounding boxes can be specified simultaneously. The perimeter of a bounding box can not exceed 500 kms.
    - Format: bbox: min_latitude,min_longtitude,max_latitude,max_longitude.
    - Example: avoid=bbox: 34.0635,-118.2547, 34.0679,-118.2478 | bbox: 34.0521,-118.2342, 34.0478,-118.2437
  - When using avoid=sharp_turn, default range of permissible turn angles is [120,240]. In order to override default range, please use turn_angle_range parameter.
  - When using avoid=geofence_id , only the the geofences created using NextBillion.ai Geofence API are valid.
  - When this parameter is not provided in the input, ferry routes are set to be avoided by default. When this parameter is provided, only the mentioned object(s) are avoided.
  - If none is provided along with other values, an error is returned as a valid route is not feasible.

  Format: value_1|value_2|...

  Default: ferry

  Example: avoid=toll|highway|bbox:34.0635,-118.2547,34.0679,-118.2478|geofence_id:d887f0fa-fd4b-478e-a585-23835a5acd78
  */
  avoid?:
    | 'toll'
    | 'ferry'
    | 'highway'
    | 'service_road'
    | 'uturn'
    | 'sharp_turn'
    | 'left_turn'
    | 'right_turn'
    | 'bbox'
    | 'genfence_id'
    | 'tunnel'
    | 'none'
  /*
  This parameter serves as a mandatory filter, ensuring the service returns only those routes that strictly avoid the object(s) indicated. Multiple values should be separated by a pipe (`|`). If no routes can be found that exclude the specified object(s), the service will return a 4xx error. For a less strict filtering approach, consider using the avoid parameter.

  Note:

  - This parameter is effective only when route_type=fastest.
  - When using exclude=sharp_turn, default range of permissible turn angles is [120,240]. In order to override default range, please use turn_angle_range parameter.
  - If none is provided along with other values, an error is returned as a valid route is not feasible.

  Format: value_1|value_2|...

  Default: none

  Example: exclude= highway|toll|uturn 
    */
  exclude?: 'toll' | 'ferry' | 'highway' | 'service_road' | 'uturn' | 'sharp_turn' | 'left_turn' | 'right_turn' | 'none'
  /*
  A semicolon-separated list indicating the side of the road from which to approach waypoints in a requested route.

  When set to unrestricted a route can arrive at the waypoint from either side of the road and when set to curb the route will arrive at the waypoint on the driving side of the region.

  Please note the number of values provided must be one more than the number of waypoints. The last value of approaches will determine the approach for the destination. However, you can skip a coordinate and show its position in the list with the ; separator.

  Format: approaches_1;approaches_2;approaches_3;...

  Default: unrestricted

  Example: approaches=unrestricted;curb;;unrestricted 
  */
  approaches?: 'unrestricted' | 'curb'
  /*
  Limits the search to segments with given bearing in degrees towards true north in clockwise direction. Each bearing should be in the format of degree,range, where the degree should be a value between [0, 360] and range should be a value between [0, 180].

  Please note that the number of bearings should be equal to the sum of the number of points in origins and destinations. If a route can approach a destination from any direction, the bearing for that point can be specified as "0,180".
  */
  bearings?: Array<{ degree: number; range: number }>
  /*
  Use this parameter to set a departure time, expressed as UNIX epoch timestamp in seconds, for calculating the isochrone contour. The response will consider the typical traffic conditions at the given time and return a contour which can be reached under those traffic conditions.

  Please note that if no input is provided for this parameter then the traffic conditions at the time of making the request are considered.

  Example: departure_time=1563254734
  */
  departure_time?: number
  /*
  This defines the dimensions of a truck in centimeters (cm). This parameter is effective only when the mode=truck. Maximum dimensions are as follows:
  Height = 1000 cm
  Width = 5000 cm
  Length = 5000 cm
  */
  truck_size?: string
  // This parameter defines the weight of the truck including trailers and shipped goods in kilograms (kg). This parameter is effective only when mode=truck.
  truck_weight?: number
  /*
  Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle.

  Please note this parameter is effective only when `mode=truck`.
  */
  truck_axle_load?: number
  // Set the route type that needs to be returned.
  route_type?: 'fastest' | 'shortest'
  /*
  When true the API will return alternate routes.

  The alternatives is effective only when there are no waypoints included in the request and the route_type is set to shortest.

  You can set the number of alternate routes to be returned in the altcount property.
  */
  alternatives?: boolean
  /*
  Sets the number of alternative routes to return. It is effective only when alternatives is true.

  Please note that adding alternative route count does not guarantee matching number of routes to be returned if potential alternative routes do not exist.
  */
  altcount?: number
  /*
  Use this parameter to receive additional information about the road segments returned in the response. Currently, following inputs are supported:

    max_speed : segment-wise maximum speed information of roads in the response.
    toll_distance : returns the total distance travelled on the road segments having tolls.
    toll_cost: returns the range of toll charges, in local currency, that can be incurred for the suggested route.
  */
  road_info?: 'max_speed' | 'toll_distance' | 'toll_cost'
  /*
  Specify if crossing an international border is expected for operations near border areas. When set to false, the API will prohibit routes going back & forth between countries. Consequently, routes within the same country will be preferred if they are feasible for the given set of destination or waypoints . When set to true, the routes will be allowed to go back & forth between countries as needed.

  This feature is available in North America region only. Please get in touch with support@nextbillion.ai to enquire/enable other areas.
  */
  cross_border?: boolean
  /*
  Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator | .

  Please note that this parameter is effective only when mode=truck.
  */
  hazmat_type?: 'general' | 'circumstantial' | 'explosive' | 'harmful_to_water'
  /*
  Specify the turn angles that can be taken safely by the vehicle. The permissible turn angles are calculated as [0 + turn_angle_range , 360 - turn_angle_range]. Please note that this parameter is effective only when avoid = sharp_turn.

  It is worth highlighting here that providing smaller angles might lead to 4xx errors as route engine might not be able find routes satisfying the smaller turn angle criteria for all turns in the routes
  */
  turn_angle_range?: number // in degrees, [0 + turn_angle_range , 360 - turn_angle_range]
  /*
  An array of durations, in seconds, for which the driver can drive continuously before taking a rest. Multiple drive time limits can be separated by a ,. After driving for the given duration the driver will take a rest for a fixed period, specified in rest_times . Once the rest duration is over, the subsequent driving duration starts and the process continues until all drive times and rest periods are exhausted or if the driver reaches the destination. This feature is useful in complying with Hours of Service regulations and calculates actual ETAs with regulated driving periods.

  As an example, a drive_time_limits = [500, 300] means that driver can drive for 500 seconds before the first rest period and then drive for another 300 seconds before taking a rest next time.

  Please note that,

    - If the trip duration is smaller than the first input of drive_time_limits, then there will be no rest actions scheduled by the service.
    - If the trip duration is larger than the scheduled time, then a "warning" is returned in the response - along with details of last leg of the trip - to indicate the same.

  Format: drive_time_limits_1, drive_time_limits_2,...

  Example: drive_time_limits=500, 400, 400
  */
  drive_time_limits?: number[]
  /*
  An array of durations, in seconds, for which the driver should rest after completing the corresponding continuous driving interval (provided in drive_time_limits). Multiple rest times can be separated by a , . Ideally, the number of rest_times provided should be equal to the number of drive_time_limits provided for proper scheduling of driver breaks.

  As an example, a rest_times = [500, 300] means that driver can rest for 500 seconds after the first continuous driving session and rest for 300 seconds after the next continuous driving session.

  Please note that:

    - If the number of rest_times provided are less than the number of drive_time_limits, the service will schedule a rest period of "0" seconds after each such drive time period which does not have a corresponding entry in rest_times.
    - If the number of rest_times provided is more than the number of drive times provided, the additional rest times are never applied.

  Format: rest_times_1,rest_times_2,rest_times_3,....

  Example: rest_times=500, 300, 100
  */
  rest_times?: number[]
}

// Response interfaces
export interface NbaiResponse {
  status?: number | string
  title?: string
  msg?: string
}

export interface PlacesDetailResponse extends NbaiResponse {
  items: Array<{
    access: Array<{
      lat: number
      lng: number
    }>
    address: {
      city: string
      countryCode: string
      countryName: string
      houseNumber: string
      label: string
      neighborhood: string
      postalCode: string
      street: string
    }
    categories: Array<{
      id: string
      name: string
      primary: boolean
    }>
    contacts?: Array<{
      phone: Array<{
        value: string
      }>
    }>
    id: string
    mapView: {
      east: number
      north: number
      south: number
      west: number
    }
    position: {
      lat: number
      lng: number
    }
    scoring: {
      fieldScore: {
        city: number
        country: number
        postalCode: number
        streets: Array<number>
      }
      queryScore: number
    }
    title: string
  }>
}

export interface DirectionsResponse extends NbaiResponse {
  routes: Array<{
    geometry: string
    distance: number
    duration: number
    start_location: {
      latitude: number
      longitude: number
    }
    end_location: {
      latitude: number
      longitude: number
    }
    geojson: {
      type: string
      geometry: {
        type: string
        coordinates: Array<number>
      }
      properties: string
    }
    legs: Array<{
      distance: {
        value: number
      }
      duration: {
        value: number
      }
      raw_duration: {
        value: number
      }
      start_location: {
        latitude: number
        longitude: number
      }
      end_location: {
        latitude: number
        longitude: number
      }
      steps: Array<{
        geometry: string
        geojson: {
          type: string
          geometry: {
            type: string
            coordinates: {}
          }
          properties: string
        }
        start_location: {
          latitude: number
          longitude: number
        }
        end_location: {
          latitude: number
          longitude: number
        }
        distance: {
          value: number
        }
        duration: {
          value: number
        }
      }>
      post_actions: Array<{
        action: string
        duration: string
      }>
      warnings: Array<{
        title: string
      }>
    }>
    road_info: {
      max_speed: Array<{
        offset: number
        length: number
        value: number
      }>
      toll_distance: number
      toll_cost: {
        minimum_toll_cost: number
        maximum_toll_cost: number
        currency: string
      }
    }
    raw_duration: number
    predicted_duration: number
    debug_info: {
      node_info: Array<{
        turn_weight: number
        turn_duration: number
        offset: number
      }>
      edge_info: Array<{
        lanes: Array<any>
        length: number
        classification: {
          link: boolean
          internal: boolean
          surface: string
          use: string
          classification: string
        }
        speed_sources: string
        special_property: {
          bridge: boolean
          destination_only: boolean
          has_sign: boolean
          is_shortcut: boolean
          round_about: boolean
          toll: boolean
          traffic_signal: boolean
          tunnel: boolean
        }
        offset: number
        edge_id: number
        region: string
        duration: number
        distance: number
        speed: number
        access_restriction: {
          part_of_complex_restriction: boolean
          end_restriction: {
            HOV: boolean
            car: boolean
            taxi: boolean
            truck: boolean
          }
          start_restriction: {
            HOV: boolean
            car: boolean
            taxi: boolean
            truck: boolean
          }
          access_restriction: boolean
          access: {
            HOV: boolean
            car: boolean
            taxi: boolean
            truck: boolean
          }
        }
        speed_limit: number
        way_id: number
        weight: number
        geo_attributes: {
          curvature: number
          max_down_slope: number
          max_up_slope: number
          weighted_grade: number
          length: number
        }
        raw_speed: {
          predicted: boolean
          constrained_flow: number
          free_flow: number
          default: number
        }
      }>
    }
  }>
}

export interface NavigationResponse extends DirectionsResponse {
  country_code: string
  routes: Array<{
    distance: number
    duration: number
    end_location: {
      latitude: number
      longitude: number
    }
    geometry: string
    legs: Array<{
      distance: {
        value: number
      }
      duration: {
        value: number
      }
      end_location: {
        latitude: number
        longitude: number
      }
      start_location: {
        latitude: number
        longitude: number
      }
      steps: Array<{
        distance: {
          value: number
        }
        driving_side: string
        duration: {
          value: number
        }
        end_location: {
          latitude: number
          longitude: number
        }
        geometry: string
        intersections: Array<{
          bearings: Array<number>
          classes: Array<string>
          entry: Array<any>
          intersection_in: number
          intersection_out: number
          lanes: Array<{
            indications: Array<string>
            valid: boolean
          }>
          location: {
            latitude: number
            longitude: number
          }
        }>
        maneuver: {
          bearing: number
          bearing_after: number
          bearing_before: number
          coordinate: {
            latitude: number
            longitude: number
          }
          instruction: string
          maneuver_type: string
          modifier: string
          voice_instruction: Array<{
            distance_along_geometry: number
            instruction: string
            unit: string
          }>
          roundabout_count?: number
          display_instruction?: string
        }
        name: string
        road_shield_type: {
          label?: string
        }
        start_location: {
          latitude: number
          longitude: number
        }
        reference?: string
      }>
    }>
    start_location: {
      latitude: number
      longitude: number
    }
  }>
}

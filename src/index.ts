#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

import type { DistanceMatrixRequest, DirectionsRequest } from './types'
import { TOOLS } from './tools'
import { handleGeocode, handlePlaceDetails, handlePlaceSearch, handleReverseGeocode } from './api/places'
import { handleDistanceMatrix } from './api/distancematrix'
import { handleDirections } from './api/directions'
import { handleNavigation } from './api/navigation'

const server = new Server(
  {
    name: 'nbai-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'geocode': {
        const { address } = request.params.arguments as { address: string }
        return await handleGeocode(address)
      }

      case 'reverse_geocode': {
        const { latitude, longitude } = request.params.arguments as {
          latitude: number
          longitude: number
        }
        return await handleReverseGeocode(latitude, longitude)
      }

      case 'search_places': {
        const { query, location, radius } = request.params.arguments as {
          query: string
          location?: { latitude: number; longitude: number }
          radius?: number
        }
        return await handlePlaceSearch(query, location, radius)
      }

      case 'place_details': {
        const { place_id } = request.params.arguments as { place_id: string }
        return await handlePlaceDetails(place_id)
      }

      case 'distance_matrix': {
        const request_args = request.params.arguments as unknown as DistanceMatrixRequest
        return await handleDistanceMatrix(request_args)
      }

      case 'directions': {
        const request_args = request.params.arguments as unknown as DirectionsRequest
        return await handleDirections(request_args)
      }

      case 'navigation': {
        const request_args = request.params.arguments as unknown as DirectionsRequest
        return await handleNavigation(request_args)
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    }
  }
})

async function runServer() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('NBAI MCP Server running on stdio')
}

runServer().catch((error) => {
  console.error('Fatal error running server:', error)
  process.exit(1)
})

# NextBillion.ai MCP Server

A Model Context Protocol (MCP) server that provides geolocation, routing, and navigation tools powered by NextBillion.ai APIs.

## Installation

```bash
npx @nbai/mcp
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "nbai": {
      "command": "npx",
      "args": ["@nbai/mcp"],
      "env": {
        "NBAI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Environment Variables

- `NBAI_API_KEY` - Your NextBillion.ai API key (required)

## Available Tools

- **geocode** - Convert addresses to coordinates
- **reverse_geocode** - Convert coordinates to addresses
- **search_places** - Search for places by query
- **place_details** - Get detailed information about a place
- **distance_matrix** - Calculate distances between multiple points
- **directions** - Get routing directions between points
- **navigation** - Get turn-by-turn navigation instructions

## API Key

Get your free API key at [NextBillion.ai](https://nextbillion.ai)

## License

MIT
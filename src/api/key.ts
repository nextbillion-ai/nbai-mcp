export function getApiKey(): string {
  const apiKey = process.env.NBAI_API_KEY
  if (!apiKey) {
    console.error('NBAI_API_KEY environment variable is not set')
    process.exit(1)
  }
  return apiKey
}

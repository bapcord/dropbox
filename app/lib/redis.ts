import { Redis } from '@upstash/redis'

if (!process.env.KV_REST_API_URL) {
  throw new Error('KV_REST_API_URL environment variable is not defined')
}

if (!process.env.KV_REST_API_TOKEN) {
  throw new Error('KV_REST_API_TOKEN environment variable is not defined')
}

// Create Redis client with retries and timeout
export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000)
  }
}) 
import '~/config/compress.config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
//
import { DB } from './config'
import { Users } from '~/routes'
import { errorHandler, notFound } from '~/middlewares'

// Initialize the Hono app with base path
const app = new Hono().basePath('/api/v1')

// Config MongoDB - Only connect if not in Cloudflare Workers environment
if (typeof process !== 'undefined') {
  DB()
}

// Logger middleware
app.use(logger())

// Compress middleware
app.use(
  compress({
    encoding: 'gzip',
    threshold: 1024, // Minimum size to compress (1KB)
  })
)

// CORS configuration (tightened for security)
app.use(
  '*',
  cors({
    origin: '*', // Specify allowed origins (update for production)
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true,
    maxAge: 86400, // Cache preflight for 1 day
  })
)

// Home Route
app.get('/', (c) => c.text('Welcome to the API!'))

// User Routes
app.route('/users', Users)

// Error Handler (improved to use err)
app.onError((err, c) => errorHandler(c))

// Not Found Handler (standardized response)
app.notFound(notFound)

const port = process.env?.PORT || 8000

export default {
  port,
  fetch: app.fetch,
}

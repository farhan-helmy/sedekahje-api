import { Context } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'

interface ErrorResponse {
  success: false
  message: string
  stack?: string | null
}

// Error Handler
export const errorHandler = (c: Context): Response => {
  const status = (c.res.status || 500) as ContentfulStatusCode

  console.error('Error:', c.error)

  return c.json<ErrorResponse>(
    {
      success: false,
      message: c.error?.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : c.error?.stack,
    },
    status
  )
}

// Not Found Handler
export const notFound = (c: Context) => {
  return c.json(
    {
      success: false,
      message: `Not Found - [${c.req.method}] ${c.req.url}`,
    },
    404 // Explicitly set 404 status
  )
}

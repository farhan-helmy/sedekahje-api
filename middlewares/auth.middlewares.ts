import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception' // Added for better error handling
import { Jwt } from 'hono/utils/jwt'
import { User, IUser } from '~/models'

// Protect Route for Authenticated Users
export const protect = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, {
      message: 'Not authorized! No token provided!',
    })
  }

  const token = authHeader.replace(/^Bearer\s+/i, '')

  try {
    const { id } = await Jwt.verify(token, process.env.JWT_SECRET || '') // Updated from Bun.env
    if (!id) {
      throw new HTTPException(401, { message: 'Invalid token payload!' })
    }

    const user = await User.findById(id).select('-password')
    if (!user) {
      throw new HTTPException(401, { message: 'User not found!' })
    }

    // Type-safe user assignment
    c.set('user', user as IUser)
    await next()
  } catch (err) {
    throw new HTTPException(401, { message: 'Invalid token! Not authorized!' })
  }
}

// Check if user is admin
export const isAdmin = async (c: Context, next: Next) => {
  const user = c.get('user') as IUser | undefined

  if (!user) {
    throw new HTTPException(401, {
      message: 'Not authorized! No user context!',
    })
  }

  if (user.isAdmin) {
    await next()
  } else {
    throw new HTTPException(403, { message: 'Not authorized as an admin!' }) // 403 for permission denied
  }
}

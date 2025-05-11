import { Context } from 'hono'
import { Institution } from '~/models'
import { IInstitution } from '~/models/institution.model'

/**
 * @desc    Get all institutions
 * @route   GET /api/v1/institutions
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 */
export const getInstitutions = async (c: Context) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit
    
    // Query with pagination
    const institutions = await Institution.find({})
      .skip(skip)
      .limit(limit)
    
    // Get total count for pagination metadata
    const total = await Institution.countDocuments({})
    
    return c.json({
      success: true,
      data: institutions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return c.json(
      { success: false, error: 'Failed to fetch institutions' },
      500
    )
  }
}

/**
 * @desc    Get institution by slug
 * @route   GET /api/v1/institutions/:slug
 * @access  Public
 */
export const getInstitutionBySlug = async (c: Context) => {
  try {
    const slug = c.req.param('slug')
    const institution = await Institution.findOne({ slug })

    if (!institution) {
      return c.json({ success: false, error: 'Institution not found' }, 404)
    }

    return c.json({ success: true, data: institution })
  } catch (error) {
    return c.json(
      { success: false, error: 'Failed to fetch institution' },
      500
    )
  }
}

/**
 * @desc    Create institution
 * @route   POST /api/v1/institutions
 * @access  Private
 */
export const createInstitution = async (c: Context) => {
  try {
    const body = await c.req.json() as IInstitution
    
    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
    }
    
    const institution = await Institution.create(body)
    return c.json({ success: true, data: institution }, 201)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create institution'
    return c.json({ success: false, error: errorMessage }, 500)
  }
}

/**
 * @desc    Update institution
 * @route   PUT /api/v1/institutions/:slug
 * @access  Private
 */
export const updateInstitution = async (c: Context) => {
  try {
    const slug = c.req.param('slug')
    const body = await c.req.json()
    
    const institution = await Institution.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    )

    if (!institution) {
      return c.json({ success: false, error: 'Institution not found' }, 404)
    }

    return c.json({ success: true, data: institution })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update institution'
    return c.json({ success: false, error: errorMessage }, 500)
  }
}

/**
 * @desc    Delete institution
 * @route   DELETE /api/v1/institutions/:slug
 * @access  Private
 */
export const deleteInstitution = async (c: Context) => {
  try {
    const slug = c.req.param('slug')
    const institution = await Institution.findOneAndDelete({ slug })

    if (!institution) {
      return c.json({ success: false, error: 'Institution not found' }, 404)
    }

    return c.json({ success: true, data: {} })
  } catch (error) {
    return c.json(
      { success: false, error: 'Failed to delete institution' },
      500
    )
  }
} 
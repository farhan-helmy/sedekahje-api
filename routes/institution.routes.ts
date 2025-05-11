import { Hono } from 'hono'
import {
  getInstitutions,
  getInstitutionBySlug,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from '~/controllers'
import { protect, isAdmin } from '~/middlewares'

// Initialize the institution routes
const institutions = new Hono()

// GET all institutions - public
institutions.get('/', getInstitutions)

// GET institution by slug - public
institutions.get('/:slug', getInstitutionBySlug)

// POST create institution - admin only
institutions.post('/', protect, isAdmin, createInstitution)

// PUT update institution - admin only
institutions.put('/:slug', protect, isAdmin, updateInstitution)

// DELETE institution - admin only
institutions.delete('/:slug', protect, isAdmin, deleteInstitution)

export default institutions 
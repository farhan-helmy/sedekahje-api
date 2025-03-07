import { Hono } from 'hono'
//
import {
  getUsers,
  createUser,
  loginUser,
  getUserById,
  getProfile,
  editProfile,
} from '~/controllers'
import { isAdmin, protect } from '~/middlewares'

const users = new Hono()

// Get All Users
users.get('/', protect, isAdmin, getUsers)

// Create User
users.post('/', createUser)

// Login User
users.post('/login', loginUser)

// Get User Profile
users.get('/profile', protect, getProfile)

// Edit User Profile
users.put('/profile', protect, editProfile)

// Get Single User
users.get('/:id', protect, isAdmin, getUserById)

export default users

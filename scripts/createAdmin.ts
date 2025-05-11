import { DB } from '~/config'
import { User } from '~/models'

// Default admin credentials
const adminData = {
  name: 'Admin User',
  email: 'admin@sedekahje.com',
  password: 'admin123',
  isAdmin: true,
}

// Connect to MongoDB
DB().then(async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email })
    
    if (adminExists) {
      console.log('Admin already exists')
      process.exit(0)
    }
    
    // Create admin
    const admin = await User.create(adminData)
    
    console.log('Admin created successfully:')
    console.log({
      name: admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}).catch((error) => {
  console.error('Error connecting to database:', error)
  process.exit(1)
}) 
import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  _id: Schema.Types.ObjectId
  name: string
  email: string
  password: string
  isAdmin: boolean
  matchPassword: (pass: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await Bun.password.verify(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    this.password = await Bun.password.hash(this.password, {
      algorithm: 'bcrypt',
      cost: 10, // number between 4-31 [Higher is secure but slower]
    })
    next()
  } catch (error) {
    next(error as Error)
  }
})

const User = model<IUser>('User', userSchema)
export default User

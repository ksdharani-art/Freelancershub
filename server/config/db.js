import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancerhub'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO, { autoIndex: true })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  }
}

export default connectDB

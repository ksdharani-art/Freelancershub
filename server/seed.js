import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Project from './models/Project.js'
import Bid from './models/Bid.js'

dotenv.config()
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancerhub'

async function seed() {
  await mongoose.connect(MONGO)
  console.log('Connected to Mongo for seeding')

  await User.deleteMany({})
  await Project.deleteMany({})
  await Bid.deleteMany({})

  const pwd = await bcrypt.hash('password123', 10)
  const client = await User.create({ name: 'Sugar Rush Bakery', email: 'client@demo.com', password: pwd, role: 'client' })
  const freelancer = await User.create({ name: 'Alex Rivera', email: 'freelancer@demo.com', password: pwd, role: 'freelancer' })
  const freelancer2 = await User.create({ name: 'Jamie Doe', email: 'freelancer2@demo.com', password: pwd, role: 'freelancer' })

  const p1 = await Project.create({ clientId: client._id, title: 'Logo redesign', description: 'I need a fresh logo for my bakery', budget: 3500 })
  const p2 = await Project.create({ clientId: client._id, title: 'Landing page', description: 'Marketing landing page for new product', budget: 8000 })

  await Bid.create({ projectId: p1._id, freelancerId: freelancer._id, amount: 3000, message: 'I can do this in 3 days' })
  await Bid.create({ projectId: p1._id, freelancerId: freelancer2._id, amount: 3200, message: 'Professional logo work' })

  console.log('Seed complete')
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })

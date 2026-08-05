
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// connect to mongo
connectDB()

// mount routes
import authRoutes from './routes/auth.js'
import projectsRoutes from './routes/projects.js'
import bidsRoutes from './routes/bids.js'
import chatsRoutes from './routes/chats.js'
import submissionsRoutes from './routes/submissions.js'
import reviewsRoutes from './routes/reviews.js'

app.use('/auth', authRoutes)
app.use('/projects', projectsRoutes)
app.use('/bids', bidsRoutes)
app.use('/chats', chatsRoutes)
app.use('/submissions', submissionsRoutes)
app.use('/reviews', reviewsRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

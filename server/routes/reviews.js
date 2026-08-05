import express from 'express'
import { postReview } from '../controllers/reviewController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requireRole('client'), postReview)

export default router

import express from 'express'
import { createBid, listBids, acceptBid } from '../controllers/bidController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requireRole('freelancer'), createBid)
router.get('/', requireAuth, listBids)
router.post('/:id/accept', requireAuth, requireRole('client'), acceptBid)

export default router

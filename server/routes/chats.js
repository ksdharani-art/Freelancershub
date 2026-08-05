import express from 'express'
import { listMessages, postMessage } from '../controllers/chatController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:projectId', requireAuth, listMessages)
router.post('/:projectId', requireAuth, postMessage)

export default router

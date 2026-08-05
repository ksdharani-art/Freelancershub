import express from 'express'
import { listProjects, getProject, createProject } from '../controllers/projectController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', requireAuth, requireRole('client'), createProject)

export default router

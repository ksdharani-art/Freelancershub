import express from 'express'
import multer from 'multer'
import { uploadSubmission, listSubmissions } from '../controllers/submissionController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import fs from 'fs'
import path from 'path'

const router = express.Router()

const uploadsDir = path.join(new URL('..', import.meta.url).pathname, 'uploads')
try { fs.mkdirSync(uploadsDir, { recursive: true }) } catch (e) {}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ts = Date.now()
    const safe = file.originalname.replace(/[^a-z0-9.\-]/gi, '_')
    cb(null, `${ts}-${safe}`)
  }
})

const upload = multer({ storage })

router.post('/', requireAuth, upload.single('file'), uploadSubmission)
router.get('/', requireAuth, listSubmissions)

export default router

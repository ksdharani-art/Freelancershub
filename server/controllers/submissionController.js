import Submission from '../models/Submission.js'
import fs from 'fs'
import path from 'path'

export const uploadSubmission = async (req, res) => {
  const { projectId } = req.body
  if (!req.file) return res.status(400).json({ error: 'No file' })
  const fileUrl = `/uploads/${req.file.filename}`
  const sub = await Submission.create({ projectId, uploaderId: req.user._id, fileUrl })
  res.json(sub)
}

export const listSubmissions = async (req, res) => {
  const { projectId } = req.query
  const filter = {}
  if (projectId) filter.projectId = projectId
  const subs = await Submission.find(filter).sort({ submittedAt: -1 })
  res.json(subs)
}

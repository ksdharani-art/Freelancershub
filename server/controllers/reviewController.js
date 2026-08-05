import Review from '../models/Review.js'
import Submission from '../models/Submission.js'
import Project from '../models/Project.js'

export const postReview = async (req, res) => {
  const { projectId, rating, comment } = req.body
  const sub = await Submission.findOne({ projectId })
  if (!sub) return res.status(400).json({ error: 'No submission found for this project' })
  const review = await Review.create({ projectId, reviewerId: req.user._id, rating, comment })
  await Project.findByIdAndUpdate(projectId, { status: 'completed' })
  res.json(review)
}

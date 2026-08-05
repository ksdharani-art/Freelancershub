import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)

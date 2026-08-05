import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
  coverLetter: { type: String },
  amount: { type: Number },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps: true })

export default mongoose.model('Application', ApplicationSchema)

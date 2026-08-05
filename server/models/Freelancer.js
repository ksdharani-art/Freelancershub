import mongoose from 'mongoose'

const FreelancerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: { type: [String], default: [] },
  bio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Freelancer', FreelancerSchema)

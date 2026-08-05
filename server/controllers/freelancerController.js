import Freelancer from '../models/Freelancer.js'

export const listFreelancers = async (req, res) => {
  try {
    const list = await Freelancer.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getFreelancer = async (req, res) => {
  try {
    const f = await Freelancer.findById(req.params.id)
    if (!f) return res.status(404).json({ error: 'Not found' })
    res.json(f)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createFreelancer = async (req, res) => {
  try {
    const { userId, skills = [], bio = '', hourlyRate } = req.body
    const f = await Freelancer.create({ userId, skills, bio, hourlyRate })
    res.json(f)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Invalid data' })
  }
}

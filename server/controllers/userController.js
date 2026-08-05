import User from '../models/User.js'

export const getUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-password')
    if (!u) return res.status(404).json({ error: 'Not found' })
    res.json(u)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

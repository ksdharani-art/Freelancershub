import Chat from '../models/Chat.js'

export const listMessages = async (req, res) => {
  const msgs = await Chat.find({ projectId: req.params.projectId }).sort({ timestamp: 1 })
  res.json(msgs)
}

export const postMessage = async (req, res) => {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Missing message' })
  const chat = await Chat.create({ projectId: req.params.projectId, senderId: req.user._id, message })
  res.json(chat)
}

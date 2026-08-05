import Bid from '../models/Bid.js'
import Project from '../models/Project.js'

export const createBid = async (req, res) => {
  const { projectId, amount, message } = req.body
  try {
    const bid = await Bid.create({ projectId, freelancerId: req.user._id, amount, message })
    res.json(bid)
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' })
  }
}

export const listBids = async (req, res) => {
  const { projectId } = req.query
  const filter = {}
  if (projectId) filter.projectId = projectId
  const bids = await Bid.find(filter).sort({ createdAt: -1 })
  res.json(bids)
}

export const acceptBid = async (req, res) => {
  const bid = await Bid.findById(req.params.id)
  if (!bid) return res.status(404).json({ error: 'Not found' })
  const project = await Project.findById(bid.projectId)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  if (String(project.clientId) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' })

  // accept this bid and reject others
  await Bid.updateMany({ projectId: project._id }, { $set: { status: 'rejected' } })
  bid.status = 'accepted'
  await bid.save()
  project.status = 'in-progress'
  await project.save()
  res.json({ bid, project })
}

import Project from '../models/Project.js'

export const listProjects = async (req, res) => {
  const { status } = req.query
  const filter = {}
  if (status) filter.status = status
  const projects = await Project.find(filter).sort({ createdAt: -1 })
  res.json(projects)
}

export const getProject = async (req, res) => {
  const p = await Project.findById(req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
}

export const createProject = async (req, res) => {
  const { title, description, budget } = req.body
  try {
    const project = await Project.create({ clientId: req.user._id, title, description, budget })
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' })
  }
}

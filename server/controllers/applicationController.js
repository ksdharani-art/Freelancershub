import Application from '../models/Application.js'
import Project from '../models/Project.js'
import Freelancer from '../models/Freelancer.js'

export const createApplication = async (req, res) => {
  try {
    const { projectId, freelancerId, coverLetter, amount } = req.body
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    const freelancer = await Freelancer.findById(freelancerId)
    if (!freelancer) return res.status(404).json({ error: 'Freelancer not found' })

    const application = await Application.create({
      projectId,
      freelancerId,
      coverLetter,
      amount,
    })

    res.status(201).json(application)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const listApplications = async (req, res) => {
  try {
    const { projectId, freelancerId } = req.query
    const filter = {}
    if (projectId) filter.projectId = projectId
    if (freelancerId) filter.freelancerId = freelancerId

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .populate('projectId', 'title status')
      .populate('freelancerId', 'skills bio hourlyRate')

    res.json(applications)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('projectId', 'title status')
      .populate('freelancerId', 'skills bio hourlyRate')

    if (!application) return res.status(404).json({ error: 'Application not found' })
    res.json(application)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) return res.status(404).json({ error: 'Application not found' })

    Object.assign(application, req.body)
    await application.save()
    res.json(application)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

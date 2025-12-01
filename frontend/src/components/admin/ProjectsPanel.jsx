import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaEdit, FaGithub, FaExternalLinkAlt, FaEye, FaEyeSlash, FaTimes, FaSave } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ConfirmationModal from './ConfirmationModal'

const ProjectsPanel = ({ onStatsUpdate }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const emptyProject = {
    title: '',
    description: '',
    technologies: [],
    github_url: '',
    live_url: '',
    image_url: '',
    featured: false,
    in_progress: false,
    future_idea: false
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/projects', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
      if (onStatsUpdate) onStatsUpdate()
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }

  const saveProject = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (editingProject.id) {
        // Update existing
        await axios.put(`/api/admin/projects/${editingProject.id}`, editingProject, config)
      } else {
        // Create new
        await axios.post('/api/admin/projects', editingProject, config)
      }

      setEditingProject(null)
      setIsCreating(false)
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    }
  }

  const handleDeleteClick = (project) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      onConfirm: () => handleDelete(project.id)
    })
  }

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/api/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConfirmModal(null) // Close modal after successful deletion
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleToggleVisibility = async (project) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(`/api/admin/projects/${project.id}`,
        { ...project, is_hidden: !project.is_hidden },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProjects()
      toast.success(`Project ${!project.is_hidden ? 'hidden' : 'visible'}`)
    } catch (error) {
      console.error('Error toggling visibility:', error)
      toast.error('Failed to update visibility')
    }
  }

  const handleTechChange = (value) => {
    const techs = value.split(',').map(t => t.trim()).filter(t => t)
    setEditingProject({ ...editingProject, technologies: techs })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading projects...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Projects</h2>
        <button
          onClick={() => {
            setEditingProject(emptyProject)
            setIsCreating(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FaPlus /> Add New Project
        </button>
      </div>

      {/* Edit/Create Form */}
      {(editingProject || isCreating) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              {editingProject.id ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button
              onClick={() => {
                setEditingProject(null)
                setIsCreating(false)
              }}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title *</label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Technologies (comma-separated) *</label>
              <input
                type="text"
                value={editingProject.technologies.join(', ')}
                onChange={(e) => handleTechChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Description *</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">GitHub URL</label>
              <input
                type="url"
                value={editingProject.github_url}
                onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Live URL</label>
              <input
                type="url"
                value={editingProject.live_url}
                onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Image URL</label>
              <input
                type="url"
                value={editingProject.image_url}
                onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-5 h-5"
                />
                Featured Project
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.in_progress}
                  onChange={(e) => setEditingProject({ ...editingProject, in_progress: e.target.checked })}
                  className="w-5 h-5"
                />
                In Progress
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.future_idea}
                  onChange={(e) => setEditingProject({ ...editingProject, future_idea: e.target.checked })}
                  className="w-5 h-5"
                />
                Future Idea
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={saveProject}
              className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
            >
              <FaSave /> Save Project
            </button>
            <button
              onClick={() => {
                setEditingProject(null)
                setIsCreating(false)
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <AnimatePresence>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: project.is_hidden ? 0.5 : 1, scale: 1 }}
              className={`bg-gray-800 rounded-lg overflow-hidden ${project.is_hidden ? 'border border-gray-600 border-dashed' : ''}`}
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.featured && (
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        Featured
                      </span>
                    )}
                    {project.in_progress && (
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                        In Progress
                      </span>
                    )}
                    {project.future_idea && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                        Future Idea
                      </span>
                    )}
                    {project.is_hidden && (
                      <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded-full text-xs ml-2">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-700 text-primary-400 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(project)}
                    className={`p-2 rounded-lg transition-all ${project.is_hidden ? 'text-gray-400 hover:bg-gray-500/20' : 'text-blue-400 hover:bg-blue-500/20'}`}
                    title={project.is_hidden ? "Show" : "Hide"}
                  >
                    {project.is_hidden ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <ConfirmationModal
        isOpen={confirmModal?.isOpen}
        onClose={() => setConfirmModal(null)}
        onConfirm={confirmModal?.onConfirm}
        title={confirmModal?.title}
        message={confirmModal?.message}
      />
    </div>
  )
}

export default ProjectsPanel


import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ConfirmationModal from './ConfirmationModal'

const SkillsPanel = ({ onStatsUpdate, onTabChange }) => {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')

  const emptySkill = {
    name: '',
    category: '',
    level: 50,
    icon: ''
  }



  useEffect(() => {
    fetchSkills()
    fetchCategories()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills')
      setSkills(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
      if (onStatsUpdate) onStatsUpdate()
    } catch (error) {
      console.error('Error fetching skills:', error)
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/skill-categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const saveSkill = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const config = { headers: { Authorization: `Bearer ${token} ` } }

      if (editingSkill.id) {
        // Update existing
        await axios.put(`/ api / admin / skills / ${editingSkill.id} `, editingSkill, config)
      } else {
        // Create new
        await axios.post('/api/admin/skills', editingSkill, config)
      }

      setEditingSkill(null)
      setIsCreating(false)
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    }
  }

  const handleDeleteClick = (skill) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Skill',
      message: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
      onConfirm: () => handleDelete(skill.id)
    })
  }

  const handleDelete = async (skillId) => {

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(`/ api / admin / skills / ${skillId} `, {
        headers: { Authorization: `Bearer ${token} ` }
      })
      fetchSkills()
      toast.success('Skill deleted successfully!')
      setConfirmModal(null) // Close modal after successful deletion
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Failed to delete skill')
    }
  }

  const filteredSkills = filterCategory === 'all'
    ? skills
    : skills.filter(s => s.category === filterCategory)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading skills...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Skills</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingSkill(emptySkill)
              setIsCreating(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <FaPlus /> Add New Skill
          </button>
          <button
            onClick={() => onTabChange && onTabChange('categories')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px - 4 py - 2 rounded - lg font - semibold transition - all ${filterCategory === 'all'
            ? 'bg-primary-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } `}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilterCategory(category.name)}
            className={`px - 4 py - 2 rounded - lg font - semibold transition - all ${filterCategory === category.name
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Edit/Create Form */}
      {(editingSkill || isCreating) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              {editingSkill.id ? 'Edit Skill' : 'Create New Skill'}
            </h3>
            <button
              onClick={() => {
                setEditingSkill(null)
                setIsCreating(false)
              }}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Skill Name *</label>
              <input
                type="text"
                value={editingSkill.name}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category *</label>
              <select
                value={editingSkill.category}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Proficiency Level: {editingSkill.level}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={editingSkill.level}
                onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Icon URL</label>
              <input
                type="text"
                value={editingSkill.icon}
                onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://example.com/icon.png"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={saveSkill}
              className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
            >
              <FaSave /> Save Skill
            </button>
            <button
              onClick={() => {
                setEditingSkill(null)
                setIsCreating(false)
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Skills Grid */}
      <AnimatePresence>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-lg p-4 text-center"
            >
              <div className="text-4xl mb-3">
                {skill.icon ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-12 h-12 mx-auto object-contain"
                  />
                ) : (
                  <span>💻</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{skill.name}</h3>
              <span className="inline-block px-3 py-1 bg-gray-700 text-primary-400 rounded-full text-xs mb-3">
                {skill.category}
              </span>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${skill.level}% ` }}
                />
              </div>
              <span className="text-gray-400 text-sm">{skill.level}%</span>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingSkill(skill)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(skill)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >              <FaTrash />
                </button>
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

export default SkillsPanel


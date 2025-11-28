
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBriefcase } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ConfirmationModal from './ConfirmationModal'

const ExperiencePanel = ({ onStatsUpdate }) => {
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingExperience, setEditingExperience] = useState(null)
    const [confirmModal, setConfirmModal] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const emptyExperience = {
        title: '',
        company: '',
        date: '',
        description: '',
        logo_url: ''
    }

    useEffect(() => {
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        try {
            const response = await axios.get('/api/experience')
            setExperiences(response.data)
            setLoading(false)
            if (onStatsUpdate) onStatsUpdate()
        } catch (error) {
            console.error('Error fetching experience:', error)
            setLoading(false)
        }
    }

    const saveExperience = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token} ` } }

            if (editingExperience.id) {
                // Update existing
                await axios.put(`/ api / admin / experience / ${editingExperience.id} `, editingExperience, config)
            } else {
                // Create new
                await axios.post('/api/admin/experience', editingExperience, config)
            }

            setEditingExperience(null)
            setIsCreating(false)
            fetchExperiences()
        } catch (error) {
            console.error('Error saving experience:', error)
            toast.error('Failed to save experience')
        }
    }

    const handleDeleteClick = (experience) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Experience',
            message: `Are you sure you want to delete "${experience.title} at ${experience.company}"? This action cannot be undone.`,
            onConfirm: () => handleDelete(experience.id)
        })
    }

    const handleDelete = async (experienceId) => {
        try {
            const token = localStorage.getItem('adminToken')
            await axios.delete(`/ api / admin / experience / ${experienceId} `, {
                headers: { Authorization: `Bearer ${token} ` }
            })
            fetchExperiences()
            toast.success('Experience deleted successfully!')
            setConfirmModal(null)
        } catch (error) {
            console.error('Error deleting experience:', error)
            toast.error('Failed to delete experience')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading experience...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Manage Experience</h2>
                <button
                    onClick={() => {
                        setEditingExperience(emptyExperience)
                        setIsCreating(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaPlus /> Add New Experience
                </button>
            </div>

            {/* Edit/Create Form */}
            {(editingExperience || isCreating) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                            {editingExperience.id ? 'Edit Experience' : 'Create New Experience'}
                        </h3>
                        <button
                            onClick={() => {
                                setEditingExperience(null)
                                setIsCreating(false)
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Job Title *</label>
                            <input
                                type="text"
                                value={editingExperience.title}
                                onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Company *</label>
                            <input
                                type="text"
                                value={editingExperience.company}
                                onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date Range *</label>
                            <input
                                type="text"
                                value={editingExperience.date}
                                onChange={(e) => setEditingExperience({ ...editingExperience, date: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., 2021 - Present"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Company Logo URL</label>
                            <input
                                type="url"
                                value={editingExperience.logo_url || ''}
                                onChange={(e) => setEditingExperience({ ...editingExperience, logo_url: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Description *</label>
                            <textarea
                                value={editingExperience.description}
                                onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={saveExperience}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                        >
                            <FaSave /> Save Experience
                        </button>
                        <button
                            onClick={() => {
                                setEditingExperience(null)
                                setIsCreating(false)
                            }}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Experience List */}
            <AnimatePresence>
                {experiences.map((exp) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                    <FaBriefcase />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                    <p className="text-primary-400">{exp.company}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{exp.date}</p>
                            <p className="text-gray-400 text-sm line-clamp-2">{exp.description}</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setEditingExperience(exp)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDeleteClick(exp)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </motion.div>
                ))}
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

export default ExperiencePanel

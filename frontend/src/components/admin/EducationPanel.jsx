import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUniversity, FaGraduationCap } from 'react-icons/fa'
import axios from 'axios'

import { toast } from 'react-hot-toast'
import ConfirmationModal from './ConfirmationModal'

const EducationPanel = ({ onStatsUpdate }) => {
    const [educationList, setEducationList] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingEducation, setEditingEducation] = useState(null)
    const [confirmModal, setConfirmModal] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const emptyEducation = {
        institution: '',
        degree: '',
        date: '',
        description: '',
        cgpa: '',
        logo_url: ''
    }

    useEffect(() => {
        fetchEducation()
    }, [])

    const fetchEducation = async () => {
        try {
            const response = await axios.get('/api/education')
            setEducationList(Array.isArray(response.data) ? response.data : [])
            setLoading(false)
            if (onStatsUpdate) onStatsUpdate()
        } catch (error) {
            console.error('Error fetching education:', error)
            setLoading(false)
        }
    }

    const saveEducation = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            if (editingEducation.id) {
                // Update existing
                await axios.put(`/api/admin/education/${editingEducation.id}`, editingEducation, config)
            } else {
                // Create new
                await axios.post('/api/admin/education', editingEducation, config)
            }

            setEditingEducation(null)
            setIsCreating(false)
            fetchEducation()
            toast.success('Education saved successfully')
        } catch (error) {
            console.error('Error saving education:', error)
            toast.error('Failed to save education')
        }
    }

    const handleDeleteClick = (edu) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Education',
            message: `Are you sure you want to delete "${edu.degree} at ${edu.institution}"? This action cannot be undone.`,
            onConfirm: () => handleDelete(edu.id)
        })
    }

    const handleDelete = async (educationId) => {

        try {
            const token = localStorage.getItem('adminToken')
            await axios.delete(`/api/admin/education/${educationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchEducation()
            toast.success('Education deleted successfully')
            setConfirmModal(null) // Close modal after successful deletion
        } catch (error) {
            console.error('Error deleting education:', error)
            toast.error('Failed to delete education')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading education...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Manage Education</h2>
                <button
                    onClick={() => {
                        setEditingEducation(emptyEducation)
                        setIsCreating(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaPlus /> Add New Education
                </button>
            </div>

            {/* Edit/Create Form */}
            {(editingEducation || isCreating) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                            {editingEducation.id ? 'Edit Education' : 'Create New Education'}
                        </h3>
                        <button
                            onClick={() => {
                                setEditingEducation(null)
                                setIsCreating(false)
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Institution *</label>
                            <input
                                type="text"
                                value={editingEducation.institution}
                                onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Degree *</label>
                            <input
                                type="text"
                                value={editingEducation.degree}
                                onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date Range *</label>
                            <input
                                type="text"
                                value={editingEducation.date}
                                onChange={(e) => setEditingEducation({ ...editingEducation, date: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., 2017 - 2021"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">CGPA</label>
                            <input
                                type="text"
                                value={editingEducation.cgpa || ''}
                                onChange={(e) => setEditingEducation({ ...editingEducation, cgpa: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., 3.8/4.0"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Institution Logo URL</label>
                            <input
                                type="url"
                                value={editingEducation.logo_url || ''}
                                onChange={(e) => setEditingEducation({ ...editingEducation, logo_url: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Description *</label>
                            <textarea
                                value={editingEducation.description}
                                onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={saveEducation}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                        >
                            <FaSave /> Save Education
                        </button>
                        <button
                            onClick={() => {
                                setEditingEducation(null)
                                setIsCreating(false)
                            }}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Education List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {educationList.map((edu) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                        <FaUniversity />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                                        <p className="text-primary-400">{edu.institution}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                                    <span>{edu.date}</span>
                                    {edu.cgpa && (
                                        <span className="flex items-center gap-1">
                                            <FaGraduationCap /> CGPA: {edu.cgpa}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2">{edu.description}</p>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => setEditingEducation(edu)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(edu)}
                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

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

export default EducationPanel

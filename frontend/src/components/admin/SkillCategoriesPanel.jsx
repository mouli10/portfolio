import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import axios from 'axios'

import { toast } from 'react-hot-toast'

const SkillCategoriesPanel = ({ onStatsUpdate }) => {
    const [categories, setCategories] = useState([])
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [deleteModal, setDeleteModal] = useState(null) // {category, skillCount}
    const [migrateTo, setMigrateTo] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [categoriesRes, skillsRes] = await Promise.all([
                axios.get('/api/skill-categories'),
                axios.get('/api/skills')
            ])
            setCategories(categoriesRes.data)
            setSkills(skillsRes.data)
            setLoading(false)
            if (onStatsUpdate) onStatsUpdate()
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const getSkillCount = (categoryName) => {
        return skills.filter(skill => skill.category === categoryName).length
    }

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return

        try {
            const token = localStorage.getItem('adminToken')
            await axios.post('/api/admin/skill-categories',
                { name: newCategoryName.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            // ... imports

            setNewCategoryName('')
            setIsAdding(false)
            fetchData()
            toast.success('Category added successfully')
        } catch (error) {
            console.error('Error adding category:', error)
            toast.error(error.response?.data?.detail || 'Failed to add category')
        }
    }

    // ...

    const handleDelete = async (categoryId, migrateToId) => {
        try {
            const token = localStorage.getItem('adminToken')
            const url = migrateToId
                ? `/api/admin/skill-categories/${categoryId}?migrate_to=${migrateToId}`
                : `/api/admin/skill-categories/${categoryId}`

            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setDeleteModal(null)
            fetchData()
            toast.success('Category deleted successfully')
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error(error.response?.data?.detail || 'Failed to delete category')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading categories...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Manage Skill Categories</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            {/* Add Category Form */}
            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Add New Category</h3>
                        <button
                            onClick={() => {
                                setIsAdding(false)
                                setNewCategoryName('')
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                            placeholder="Enter category name"
                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            autoFocus
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                        >
                            Add
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Categories List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                    const skillCount = getSkillCount(category.name)
                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                <p className="text-sm text-gray-400">{skillCount} skill{skillCount !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(category)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                            >
                                <FaTrash />
                            </button>
                        </motion.div>
                    )
                })}
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setDeleteModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <FaExclamationTriangle className="text-yellow-400 text-xl" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">Migrate Skills First</h3>
                                    <p className="text-gray-400 text-sm">
                                        This category has {deleteModal.skillCount} skill{deleteModal.skillCount !== 1 ? 's' : ''}.
                                        Select a category to move them to before deleting.
                                    </p>
                                </div>
                            </div>

                            <select
                                value={migrateTo}
                                onChange={(e) => setMigrateTo(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
                            >
                                <option value="">Select target category...</option>
                                {categories
                                    .filter(c => c.id !== deleteModal.category.id)
                                    .map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))
                                }
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal(null)}
                                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal.category.id, parseInt(migrateTo))}
                                    disabled={!migrateTo}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded-lg transition-all"
                                >
                                    Migrate & Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SkillCategoriesPanel

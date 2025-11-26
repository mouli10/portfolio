import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaAward, FaCertificate } from 'react-icons/fa'
import axios from 'axios'

import { toast } from 'react-hot-toast'

const CertificatesPanel = ({ onStatsUpdate }) => {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingCertificate, setEditingCertificate] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const emptyCertificate = {
        title: '',
        issuer: '',
        date: '',
        description: '',
        credential_url: '',
        logo_url: ''
    }

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        try {
            const response = await axios.get('/api/certificates')
            setCertificates(Array.isArray(response.data) ? response.data : [])
            setLoading(false)
            if (onStatsUpdate) onStatsUpdate()
        } catch (error) {
            console.error('Error fetching certificates:', error)
            setLoading(false)
        }
    }

    const saveCertificate = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            if (editingCertificate.id) {
                // Update existing
                await axios.put(`/api/admin/certificates/${editingCertificate.id}`, editingCertificate, config)
            } else {
                // Create new
                await axios.post('/api/admin/certificates', editingCertificate, config)
            }

            setEditingCertificate(null)
            setIsCreating(false)
            fetchCertificates()
            toast.success('Certificate saved successfully')
        } catch (error) {
            console.error('Error saving certificate:', error)
            toast.error('Failed to save certificate')
        }
    }

    const deleteCertificate = async (certificateId) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return

        try {
            const token = localStorage.getItem('adminToken')
            await axios.delete(`/api/admin/certificates/${certificateId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCertificates()
            toast.success('Certificate deleted successfully')
        } catch (error) {
            console.error('Error deleting certificate:', error)
            toast.error('Failed to delete certificate')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading certificates...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Manage Certificates</h2>
                <button
                    onClick={() => {
                        setEditingCertificate(emptyCertificate)
                        setIsCreating(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaPlus /> Add New Certificate
                </button>
            </div>

            {/* Edit/Create Form */}
            {(editingCertificate || isCreating) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                            {editingCertificate.id ? 'Edit Certificate' : 'Create New Certificate'}
                        </h3>
                        <button
                            onClick={() => {
                                setEditingCertificate(null)
                                setIsCreating(false)
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Certificate Title *</label>
                            <input
                                type="text"
                                value={editingCertificate.title}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., Google IT Automation with Python"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Issuer *</label>
                            <input
                                type="text"
                                value={editingCertificate.issuer}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., Google, Microsoft, Coursera"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date *</label>
                            <input
                                type="text"
                                value={editingCertificate.date}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, date: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="e.g., Mar 2023"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Logo URL</label>
                            <input
                                type="url"
                                value={editingCertificate.logo_url || ''}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, logo_url: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Credential URL</label>
                            <input
                                type="url"
                                value={editingCertificate.credential_url || ''}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, credential_url: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="https://coursera.org/verify/..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Description *</label>
                            <textarea
                                value={editingCertificate.description}
                                onChange={(e) => setEditingCertificate({ ...editingCertificate, description: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                rows="4"
                                placeholder="• Configuration Management, Automation&#10;• Google Cloud Platform (GCP)&#10;• Cloud Servers and VM's"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Use bullet points with • or - for better formatting</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={saveCertificate}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                        >
                            <FaSave /> Save Certificate
                        </button>
                        <button
                            onClick={() => {
                                setEditingCertificate(null)
                                setIsCreating(false)
                            }}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Certificates List */}
            <div className="space-y-4">
                {certificates.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                                    <FaCertificate />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                                    <p className="text-primary-400">{cert.issuer}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{cert.date}</p>
                            <p className="text-gray-400 text-sm line-clamp-2">{cert.description}</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setEditingCertificate(cert)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => deleteCertificate(cert.id)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default CertificatesPanel

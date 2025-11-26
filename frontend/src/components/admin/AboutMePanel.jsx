import { useState, useEffect } from 'react'
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'

import { toast } from 'react-hot-toast'

const AboutMePanel = () => {
    const [aboutMe, setAboutMe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchAboutMe()
    }, [])

    const fetchAboutMe = async () => {
        try {
            const response = await axios.get('/api/about-me')
            setAboutMe(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching about me:', error)
            setLoading(false)
        }
    }

    const saveAboutMe = async () => {
        try {
            setSaving(true)

            // ... imports

            const token = localStorage.getItem('adminToken')
            await axios.put('/api/admin/about-me', aboutMe, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('About Me content saved successfully!')
            setSaving(false)
        } catch (error) {
            console.error('Error saving about me:', error)
            toast.error('Failed to save about me content')
            setSaving(false)
        }
    }

    const addHighlight = () => {
        setAboutMe({
            ...aboutMe,
            highlights: [
                ...aboutMe.highlights,
                { icon: 'FaCode', title: '', description: '' }
            ]
        })
    }

    const updateHighlight = (index, field, value) => {
        const newHighlights = [...aboutMe.highlights]
        newHighlights[index][field] = value
        setAboutMe({ ...aboutMe, highlights: newHighlights })
    }

    const removeHighlight = (index) => {
        const newHighlights = aboutMe.highlights.filter((_, i) => i !== index)
        setAboutMe({ ...aboutMe, highlights: newHighlights })
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading about me content...</p>
            </div>
        )
    }

    if (!aboutMe) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No about me content found</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">About Me Content</h2>
                <button
                    onClick={saveAboutMe}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-8">
                {/* Journey Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Journey Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Section Title</label>
                            <input
                                type="text"
                                value={aboutMe.journey_title}
                                onChange={(e) => setAboutMe({ ...aboutMe, journey_title: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Journey Text</label>
                            <textarea
                                value={aboutMe.journey_text}
                                onChange={(e) => setAboutMe({ ...aboutMe, journey_text: e.target.value })}
                                rows={8}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Write your journey story here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Highlights</h3>
                        <button
                            onClick={addHighlight}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                        >
                            <FaPlus /> Add Highlight
                        </button>
                    </div>
                    <div className="space-y-4">
                        {aboutMe.highlights.map((highlight, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Icon</label>
                                        <input
                                            type="text"
                                            value={highlight.icon}
                                            onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                                            placeholder="FaCode"
                                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={highlight.title}
                                            onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                            placeholder="Clean Code"
                                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-sm text-gray-400 mb-2">Description</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                value={highlight.description}
                                                onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                                                rows={2}
                                                placeholder="Writing maintainable and scalable code..."
                                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                            <button
                                                onClick={() => removeHighlight(index)}
                                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all self-start"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Icon names: FaCode, FaLaptopCode, FaRocket, FaUsers, FaLightbulb, FaCog, FaPalette, FaChartLine
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutMePanel

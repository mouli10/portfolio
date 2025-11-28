import { useState, useEffect } from 'react'
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import FileUpload from './FileUpload'

import { toast } from 'react-hot-toast'

const SiteSettingsPanel = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/site-settings')
            setSettings(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching settings:', error)
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        try {
            setSaving(true)

            // ... imports

            const token = localStorage.getItem('adminToken')
            await axios.put('/api/admin/site-settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('Settings saved successfully!')
            setSaving(false)
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Failed to save settings')
            setSaving(false)
        }
    }

    const addSocialLink = () => {
        setSettings({
            ...settings,
            social_links: [
                ...settings.social_links,
                { platform: '', url: '', icon: 'FaLink' }
            ]
        })
    }

    const updateSocialLink = (index, field, value) => {
        const newLinks = [...settings.social_links]
        newLinks[index][field] = value
        setSettings({ ...settings, social_links: newLinks })
    }

    const removeSocialLink = (index) => {
        const newLinks = settings.social_links.filter((_, i) => i !== index)
        setSettings({ ...settings, social_links: newLinks })
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading settings...</p>
            </div>
        )
    }

    if (!settings) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No settings found</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Site Settings</h2>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-8">
                {/* Personal Info Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={settings.full_name}
                                onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        {/* Rotating Titles Section */}
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm text-gray-400">Rotating Titles (Typewriter Effect)</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTitles = settings.titles ? [...settings.titles, ''] : ['']
                                        setSettings({ ...settings, titles: newTitles })
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm transition-all"
                                >
                                    <FaPlus className="text-xs" /> Add Title
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(settings.titles && settings.titles.length > 0 ? settings.titles : [settings.title]).map((title, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => {
                                                const newTitles = settings.titles ? [...settings.titles] : [settings.title]
                                                newTitles[index] = e.target.value
                                                setSettings({ ...settings, titles: newTitles })
                                            }}
                                            placeholder={`Title ${index + 1} (e.g., Full Stack Developer)`}
                                            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                        {(settings.titles && settings.titles.length > 1) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTitles = settings.titles.filter((_, i) => i !== index)
                                                    setSettings({ ...settings, titles: newTitles })
                                                }}
                                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Add multiple titles to create a rotating typewriter effect on your homepage
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Tagline *</label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Bio *</label>
                            <textarea
                                value={settings.bio}
                                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.email || ''}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={settings.phone || ''}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Location</label>
                            <input
                                type="text"
                                value={settings.location || ''}
                                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Assets Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Assets</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload
                                label="Profile Image"
                                accept="image/*"
                                currentUrl={settings.profile_image_url}
                                onUpload={(url) => setSettings({ ...settings, profile_image_url: url })}
                            />
                        </div>
                        <div>
                            <FileUpload
                                label="Logo"
                                accept="image/*"
                                currentUrl={settings.logo_url}
                                onUpload={(url) => setSettings({ ...settings, logo_url: url })}
                            />
                        </div>
                        <div>
                            <FileUpload
                                label="Resume (PDF)"
                                accept=".pdf"
                                type="file"
                                currentUrl={settings.resume_url}
                                onUpload={(url) => setSettings({ ...settings, resume_url: url })}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">About Me Stats</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Years Experience</label>
                            <input
                                type="text"
                                value={settings.years_experience}
                                onChange={(e) => setSettings({ ...settings, years_experience: e.target.value })}
                                placeholder="5+"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Projects Completed</label>
                            <input
                                type="text"
                                value={settings.projects_completed}
                                onChange={(e) => setSettings({ ...settings, projects_completed: e.target.value })}
                                placeholder="50+"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Lines of Code</label>
                            <input
                                type="text"
                                value={settings.lines_of_code}
                                onChange={(e) => setSettings({ ...settings, lines_of_code: e.target.value })}
                                placeholder="100K+"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Social Links</h3>
                        <button
                            onClick={addSocialLink}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                        >
                            <FaPlus /> Add Link
                        </button>
                    </div>
                    <div className="space-y-4">
                        {settings.social_links.map((link, index) => (
                            <div key={index} className="grid md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Platform</label>
                                    <input
                                        type="text"
                                        value={link.platform}
                                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                        placeholder="GitHub"
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">URL</label>
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Icon</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={link.icon}
                                            onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                                            placeholder="FaGithub"
                                            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                        <button
                                            onClick={() => removeSocialLink(index)}
                                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Icon names: FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaEnvelope, FaGlobe, FaPhone
                    </p>
                </div>

                {/* Site Metadata Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Site Metadata</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Site Title</label>
                            <input
                                type="text"
                                value={settings.site_title}
                                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                placeholder="Portfolio"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Site Description</label>
                            <input
                                type="text"
                                value={settings.site_description || ''}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                placeholder="My professional portfolio"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SiteSettingsPanel

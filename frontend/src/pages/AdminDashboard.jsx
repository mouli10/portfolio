import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSignOutAlt, FaChartBar, FaEnvelope, FaProjectDiagram, FaCog, FaBriefcase, FaFolderOpen, FaGraduationCap, FaCertificate, FaUserCog } from 'react-icons/fa'
import axios from 'axios'
import MessagesPanel from '../components/admin/MessagesPanel'
import ProjectsPanel from '../components/admin/ProjectsPanel'
import SkillsPanel from '../components/admin/SkillsPanel'
import StatsPanel from '../components/admin/StatsPanel'
import ExperiencePanel from '../components/admin/ExperiencePanel'
import EducationPanel from '../components/admin/EducationPanel'
import CertificatesPanel from '../components/admin/CertificatesPanel'
import SkillCategoriesPanel from '../components/admin/SkillCategoriesPanel'
import SiteSettingsPanel from '../components/admin/SiteSettingsPanel'
import AboutMePanel from '../components/admin/AboutMePanel'

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState(null)

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: FaChartBar },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'skills', label: 'Skills', icon: FaCog },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'about', label: 'About Me', icon: FaUserCog },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ]

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              <tab.icon /> {tab.label}
              {tab.id === 'messages' && stats?.unread_messages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.unread_messages}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'stats' && <StatsPanel stats={stats} />}
          {activeTab === 'messages' && <MessagesPanel />}
          {activeTab === 'projects' && <ProjectsPanel onStatsUpdate={fetchStats} />}
          {activeTab === 'experience' && <ExperiencePanel onStatsUpdate={fetchStats} />}
          {activeTab === 'skills' && <SkillsPanel onStatsUpdate={fetchStats} onTabChange={setActiveTab} />}
          {activeTab === 'certificates' && <CertificatesPanel onStatsUpdate={fetchStats} />}
          {activeTab === 'education' && <EducationPanel onStatsUpdate={fetchStats} />}
          {activeTab === 'categories' && <SkillCategoriesPanel />}
          {activeTab === 'about' && <AboutMePanel />}
          {activeTab === 'settings' && <SiteSettingsPanel />}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard


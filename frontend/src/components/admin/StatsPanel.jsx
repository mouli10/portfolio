import { motion } from 'framer-motion'
import { FaProjectDiagram, FaCog, FaEnvelope, FaStar, FaEnvelopeOpen, FaBriefcase } from 'react-icons/fa'

const StatsPanel = ({ stats, onRefresh }) => {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading stats...</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.total_projects,
      icon: FaProjectDiagram,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Featured Projects',
      value: stats.featured_projects,
      icon: FaStar,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Total Skills',
      value: stats.total_skills,
      icon: FaCog,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Total Experience',
      value: stats.total_experience,
      icon: FaBriefcase,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      label: 'Total Messages',
      value: stats.total_messages,
      icon: FaEnvelope,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Unread Messages',
      value: stats.unread_messages,
      icon: FaEnvelopeOpen,
      color: 'from-red-500 to-rose-500'
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Overview</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
        >
          Refresh Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                <stat.icon size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 rounded-lg p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Welcome to Your Admin Dashboard! 🎉</h3>
        <p className="text-gray-300 mb-4">
          From here, you can manage all aspects of your portfolio:
        </p>
        <ul className="space-y-2 text-gray-400">
          <li>• <strong className="text-white">Messages:</strong> View and respond to contact form submissions</li>
          <li>• <strong className="text-white">Projects:</strong> Add, edit, or delete your portfolio projects</li>
          <li>• <strong className="text-white">Skills:</strong> Manage your skill set and proficiency levels</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default StatsPanel


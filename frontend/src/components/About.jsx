import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import { FaCode, FaLaptopCode, FaRocket, FaUsers, FaLightbulb, FaCog, FaPalette, FaChartLine } from 'react-icons/fa'

const iconMap = {
  FaCode,
  FaLaptopCode,
  FaRocket,
  FaUsers,
  FaLightbulb,
  FaCog,
  FaPalette,
  FaChartLine
}

const About = () => {
  const [settings, setSettings] = useState(null)
  const [aboutMe, setAboutMe] = useState(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/site-settings')
        setSettings(response.data)
      } catch (error) {
        console.error('Error fetching site settings:', error)
      }
    }

    const fetchAboutMe = async () => {
      try {
        const response = await axios.get('/api/about-me')
        setAboutMe(response.data)
      } catch (error) {
        console.error('Error fetching about me:', error)
      }
    }

    fetchSettings()
    fetchAboutMe()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="about" className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Journey Text */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700 hover:border-primary-500 transition-all space-y-6"
            >
              <h3 className="text-3xl font-bold text-gradient">
                {aboutMe?.journey_title || 'My Journey'}
              </h3>
              <div className="text-gray-300 text-lg leading-relaxed space-y-4 text-justify">
                {aboutMe?.journey_text ? (
                  aboutMe.journey_text.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
              {aboutMe?.highlights ? (
                aboutMe.highlights.map((highlight, index) => {
                  const IconComponent = iconMap[highlight.icon] || FaCode
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-primary-500 transition-all"
                    >
                      <IconComponent className="text-4xl text-primary-400 mb-4" />
                      <h4 className="text-lg font-bold text-white mb-2">{highlight.title}</h4>
                      <p className="text-gray-400 text-sm">{highlight.description}</p>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-2 text-center text-gray-400">Loading highlights...</div>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {settings && [
              { label: 'Years Experience', value: settings.years_experience },
              { label: 'Projects Completed', value: settings.projects_completed },
              { label: 'Lines of Code', value: settings.lines_of_code },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-gradient mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About

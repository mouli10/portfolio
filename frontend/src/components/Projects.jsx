import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaStar, FaGithub, FaExternalLinkAlt, FaClock, FaLightbulb } from 'react-icons/fa'
import axios from 'axios'
import { useData } from '../context/DataContext'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')
  const { settings } = useData()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await axios.get('/api/projects')
        setProjects(projectsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects

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
    <section id="projects" className="py-20 bg-transparent relative overflow-hidden">
      {/* Background decoration */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
          </motion.div>

          {/* Filter Buttons */}
          {/* Removed filter buttons div */}

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-primary-500/20 transition-all group"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-500/10 to-purple-500/10 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-5xl">
                      💻
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaStar size={12} /> Featured
                    </div>
                  )}
                  {project.in_progress && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaClock size={12} /> In Progress
                    </div>
                  )}
                  {project.future_idea && (
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaLightbulb size={12} /> Future Idea
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gradient mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-gray-700 text-primary-400 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <FaGithub /> Code
                      </motion.a>
                    )}
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 rounded-lg transition-colors"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View More Button */}
          {filteredProjects.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-12"
            >
              <motion.a
                href={settings?.social_links?.find(link => link.platform === 'GitHub')?.url || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-500 text-primary-400 rounded-full font-semibold hover:bg-primary-500/10 transition-all"
              >
                <FaGithub /> View More on GitHub
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects


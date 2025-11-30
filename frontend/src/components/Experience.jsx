import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'

const Experience = () => {
    const [experiences, setExperiences] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get('/api/experience')
                setExperiences(response.data)
            } catch (error) {
                console.error('Error fetching experience:', error)
            }
        }
        fetchExperiences()
    }, [])

    const selectedExperience = experiences[selectedIndex]

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
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    }

    return (
        <section id="experience" className="py-20 bg-transparent relative overflow-hidden">
            {/* Background decoration */}


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
                            My <span className="text-gradient">Experience</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
                    </motion.div>

                    {/* Experience Content */}
                    {experiences.length > 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className="grid md:grid-cols-[350px_1fr] gap-8"
                        >
                            {/* Left Side - Tabs */}
                            <div className="space-y-2">
                                {experiences.map((exp, index) => (
                                    <motion.button
                                        key={exp.id}
                                        onClick={() => setSelectedIndex(index)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${selectedIndex === index
                                            ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-l-4 border-primary-500'
                                            : 'bg-gray-900 hover:bg-gray-800 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Logo */}
                                            {exp.logo_url ? (
                                                <img
                                                    src={exp.logo_url}
                                                    alt={`${exp.company} logo`}
                                                    width="48"
                                                    height="48"
                                                    loading="lazy"
                                                    className="w-12 h-12 object-contain rounded-lg bg-white p-2 flex-shrink-0"
                                                    style={{ aspectRatio: '1 / 1' }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FaBriefcase className="text-primary-400" />
                                                </div>
                                            )}

                                            {/* Title and Company */}
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className={`font-semibold text-sm mb-1 truncate ${selectedIndex === index ? 'text-white' : 'text-gray-300'
                                                        }`}
                                                >
                                                    {exp.title}
                                                </h3>
                                                <p
                                                    className={`text-xs truncate ${selectedIndex === index ? 'text-primary-400' : 'text-gray-500'
                                                        }`}
                                                >
                                                    {exp.company}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Right Side - Details */}
                            <AnimatePresence mode="wait">
                                {selectedExperience && (
                                    <motion.div
                                        key={selectedExperience.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gray-900 rounded-lg p-8 border border-gray-700"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-6">
                                            {selectedExperience.logo_url ? (
                                                <img
                                                    src={selectedExperience.logo_url}
                                                    alt={`${selectedExperience.company} logo`}
                                                    className="w-16 h-16 object-contain rounded-lg bg-white p-3"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                                    <FaBriefcase className="text-primary-400 text-2xl" />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-1">
                                                    {selectedExperience.title}
                                                </h3>
                                                <p className="text-lg text-primary-400">
                                                    {selectedExperience.company}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center text-gray-400 text-sm mb-6">
                                            <FaCalendarAlt className="mr-2" />
                                            {selectedExperience.date}
                                        </div>

                                        {/* Description */}
                                        <div className="text-gray-300 leading-relaxed">
                                            {selectedExperience.description.split('\n').map((line, idx) => {
                                                const trimmedLine = line.trim()
                                                if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                                    return (
                                                        <div key={idx} className="flex items-start gap-3 mb-3">
                                                            <span className="text-primary-400 mt-1">•</span>
                                                            <span>{trimmedLine.substring(1).trim()}</span>
                                                        </div>
                                                    )
                                                }
                                                return trimmedLine ? <p key={idx} className="mb-3">{trimmedLine}</p> : null
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading experience...</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

export default Experience

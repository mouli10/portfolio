import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa'
import axios from 'axios'

const Certificates = () => {
    const [certificates, setCertificates] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get('/api/certificates')
                setCertificates(response.data)
            } catch (error) {
                console.error('Error fetching certificates:', error)
            }
        }
        fetchCertificates()
    }, [])

    // Auto-play carousel
    useEffect(() => {
        if (certificates.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % certificates.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [certificates.length])

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

    // Get certificate at specific position (handles looping)
    const getCertificateAtPosition = (position) => {
        if (certificates.length === 0) return null
        const len = certificates.length
        const index = ((currentIndex + position) % len + len) % len
        return certificates[index]
    }

    const leftCert = getCertificateAtPosition(-1)
    const centerCert = getCertificateAtPosition(0)
    const rightCert = getCertificateAtPosition(1)

    const renderCertificateCard = (cert, position) => {
        if (!cert) return null

        // Determine rotation based on position
        const isLeft = position === 'left'
        const isRight = position === 'right'
        const isCenter = position === 'center'

        const rotateY = isLeft ? -12 : isRight ? 12 : 0
        const opacity = isCenter ? 1 : 0.7

        return (
            <motion.div
                key={`${cert.id}-${position}`}
                animate={{
                    rotateY: rotateY,
                    opacity: opacity,
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300"
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    {cert.logo_url ? (
                        <img
                            src={cert.logo_url}
                            alt={`${cert.issuer} logo`}
                            loading="lazy"
                            className="h-16 w-16 object-contain"
                        />
                    ) : (
                        <div className="h-16 w-16 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <FaAward className="text-primary-400 text-3xl" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                    {cert.title}
                </h3>

                {/* Issuer */}
                <p className="text-gray-400 text-center mb-2">{cert.issuer}</p>

                {/* Date */}
                <p className="text-gray-500 text-sm text-center mb-4">{cert.date}</p>

                {/* Description */}
                <div className="text-gray-300 text-sm mb-4 min-h-[80px]">
                    {cert.description.split('\n').map((line, idx) => {
                        const trimmedLine = line.trim()
                        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                            return (
                                <div key={idx} className="flex items-start gap-2 mb-1">
                                    <span className="text-primary-400 mt-1">•</span>
                                    <span className="text-xs">{trimmedLine.substring(1).trim()}</span>
                                </div>
                            )
                        }
                        return trimmedLine ? (
                            <p key={idx} className="mb-1 text-xs">
                                {trimmedLine}
                            </p>
                        ) : null
                    })}
                </div>

                {/* View Credential Button */}
                {cert.credential_url && (
                    <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all text-sm"
                    >
                        View Credential
                        <FaExternalLinkAlt className="text-xs" />
                    </a>
                )}
            </motion.div>
        )
    }

    return (
        <section id="certificates" className="py-20 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={containerVariants}
                >
                    {/* Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            My <span className="text-gradient">Certificates</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
                    </motion.div>

                    {/* Certificates Carousel */}
                    {certificates.length > 0 ? (
                        <div className="relative">
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                style={{
                                    perspective: '1200px',
                                }}
                            >
                                {/* Hide left/right cards on mobile, show on md+ */}
                                <div className="hidden md:block">
                                    {leftCert && renderCertificateCard(leftCert, 'left')}
                                </div>
                                {centerCert && renderCertificateCard(centerCert, 'center')}
                                <div className="hidden md:block">
                                    {rightCert && renderCertificateCard(rightCert, 'right')}
                                </div>
                            </div>

                            {/* Carousel Indicators */}
                            <div className="flex justify-center gap-2 mt-8">
                                {certificates.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'w-8 bg-primary-500'
                                            : 'w-2 bg-gray-600 hover:bg-gray-500'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading certificates...</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

export default Certificates

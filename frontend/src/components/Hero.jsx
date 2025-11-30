import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaMobile, FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaGlobe, FaLink, FaPhone } from 'react-icons/fa'
import { HiArrowDown } from 'react-icons/hi'
import Typewriter from './Typewriter'
import { useData } from '../context/DataContext'

const iconMap = {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaGlobe,
  FaLink,
  FaPhone
}

const Hero = () => {
  const [showInstagramPopup, setShowInstagramPopup] = useState(false)
  const { settings, loading } = useData()

  if (loading || !settings) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </section>
    )
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 p-1 animate-float">
              <img
                src={settings.profile_image_url || '/profile.jpeg'}
                alt="Profile"
                width="256"
                height="256"
                loading="eager"
                className="w-full h-full rounded-full object-cover"
                style={{ aspectRatio: '1 / 1' }}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ willChange: 'opacity' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-3xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12"
            >
              <p className="mb-4">
                Hello, I'm <span className="text-gradient font-bold">{settings.full_name}</span>, <span className="inline sm:hidden"><br /></span>a <span className="text-white font-bold"><Typewriter words={settings.titles && settings.titles.length > 0 ? settings.titles : [settings.title]} /></span>.
              </p>
              <p className="mb-2">{settings.tagline}</p>
              <p>{settings.bio}</p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center space-x-6"
            >
              {settings.social_links.map((social, index) => {
                const IconComponent = iconMap[social.icon] || FaLink
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (social.platform === 'Instagram') {
                        e.preventDefault()
                        setShowInstagramPopup(true)
                        setTimeout(() => setShowInstagramPopup(false), 3000)
                      }
                    }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-gray-300 hover:text-primary-400 text-3xl transition-colors"
                    aria-label={social.platform}
                  >
                    <IconComponent />
                  </motion.a>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <motion.a
              href="#about"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block text-gray-400 hover:text-primary-400 transition-colors"
            >
              <HiArrowDown className="text-4xl" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Instagram Popup */}
      <AnimatePresence>
        {showInstagramPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4"
            >
              <div className="text-center text-white">
                <FaInstagram className="text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
                <p className="text-lg opacity-90">
                  Follow me on Instagram for updates
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Hero

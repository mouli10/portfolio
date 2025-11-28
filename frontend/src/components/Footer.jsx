import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaInstagram, FaFacebook, FaYoutube, FaGlobe, FaLink, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useData } from '../context/DataContext'

const iconMap = {
  'GitHub': FaGithub,
  'LinkedIn': FaLinkedin,
  'Twitter': FaTwitter,
  'Instagram': FaInstagram,
  'Facebook': FaFacebook,
  'YouTube': FaYoutube,
  'Website': FaGlobe,
  'Email': FaEnvelope,
  'Phone': FaPhone
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { settings } = useData()

  const socialLinks = settings?.social_links?.map(link => ({
    icon: iconMap[link.platform] || FaLink,
    href: link.url,
    label: link.platform
  })) || []

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm m-0">
            © {currentYear} Mouli's Portfolio. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-2 m-0">
            Made with <FaHeart className="text-red-500" /> while sipping Coffee
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


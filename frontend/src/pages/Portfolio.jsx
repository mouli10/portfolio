import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Certificates from '../components/Certificates'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ReactGA from 'react-ga4'

function Portfolio() {
  const [scrolled, setScrolled] = useState(false)
  const { isDark } = useTheme()

  // Initialize Google Analytics
  useEffect(() => {
    ReactGA.initialize('G-K5KRX1RFE7')
    ReactGA.send('pageview')
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Toaster position="top-right" />
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Portfolio

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import { DataProvider, useData } from './context/DataContext'

function AppContent() {
  const { settings } = useData()

  useEffect(() => {
    if (settings) {
      if (settings.site_title) {
        document.title = settings.site_title
      }

      if (settings.site_description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', settings.site_description)
        }

        // Update OG and Twitter description
        const ogDescription = document.querySelector('meta[property="og:description"]')
        if (ogDescription) ogDescription.setAttribute('content', settings.site_description)

        const twitterDescription = document.querySelector('meta[property="twitter:description"]')
        if (twitterDescription) twitterDescription.setAttribute('content', settings.site_description)
      }

      if (settings.site_title) {
        document.title = settings.site_title

        // Update OG and Twitter title
        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) ogTitle.setAttribute('content', settings.site_title)

        const twitterTitle = document.querySelector('meta[property="twitter:title"]')
        if (twitterTitle) twitterTitle.setAttribute('content', settings.site_title)
      }

      // Update OG and Twitter Image (use logo or profile image)
      const shareImage = settings.logo_url || settings.profile_image_url
      if (shareImage) {
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage) ogImage.setAttribute('content', shareImage)

        const twitterImage = document.querySelector('meta[property="twitter:image"]')
        if (twitterImage) twitterImage.setAttribute('content', shareImage)
      }

      // Also update favicon if provided
      if (settings.logo_url) {
        const favicon = document.querySelector('link[rel="icon"]')
        if (favicon) {
          favicon.setAttribute('href', settings.logo_url)
        }
      } else if (settings.favicon_url) {
        const favicon = document.querySelector('link[rel="icon"]')
        if (favicon) {
          favicon.setAttribute('href', settings.favicon_url)
        }
      }
    }
  }, [settings])

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}

export default App


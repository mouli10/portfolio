import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/site-settings')
        setSettings(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching site settings:', err)
        setError(err)
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <DataContext.Provider value={{ settings, loading, error }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

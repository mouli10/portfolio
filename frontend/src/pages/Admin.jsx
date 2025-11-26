import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const Admin = () => {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        // Store token for axios interceptor (if we were using one, but we'll update calls directly)
        localStorage.setItem('adminToken', session.access_token)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        localStorage.setItem('adminToken', session.access_token)
      } else {
        localStorage.removeItem('adminToken')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return session ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin />
  )
}

export default Admin


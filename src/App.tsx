import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Todos from './pages/Todos'
import Calendar from './pages/Calendar'
import Notebook from './pages/Notebook'
import Settings from './pages/Settings'
import ClockPage from './pages/Clock'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { useStore } from './store/useStore'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useStore()
  const location = useLocation()

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Layout>{children}</Layout>
}

function App() {
  const { initialize } = useStore()

  useEffect(() => {
    const unsubscribe = initialize()
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [initialize])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/todos" element={<AuthGuard><Todos /></AuthGuard>} />
      <Route path="/calendar" element={<AuthGuard><Calendar /></AuthGuard>} />
      <Route path="/notebook" element={<AuthGuard><Notebook /></AuthGuard>} />
      <Route path="/clock" element={<AuthGuard><ClockPage /></AuthGuard>} />
      <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
      <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
    </Routes>
  )
}

export default App

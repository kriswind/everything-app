import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Todos from './pages/Todos'
import Calendar from './pages/Calendar'
import Notebook from './pages/Notebook'
import Settings from './pages/Settings'
import ClockPage from './pages/Clock'
import Profile from './pages/Profile'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/clock" element={<ClockPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App

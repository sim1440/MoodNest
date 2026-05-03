import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from './firebase/firebase'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ChatBot from './pages/ChatBot'
import Tasks from './pages/Tasks'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

const auth = getAuth(app)

function ProtectedRoute({ user, loading, children }) {
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#7B9E87', fontSize: 16 }}>Loading MoodNest... 🌿</div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute user={user} loading={loading}><ChatBot /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute user={user} loading={loading}><Tasks /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute user={user} loading={loading}><Analytics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user} loading={loading}><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
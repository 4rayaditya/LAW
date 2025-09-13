import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import SimpleLoginPage from './pages/SimpleLoginPage'
import Dashboard from './pages/Dashboard'
import CaseDetailPage from './pages/CaseDetailPage'
import FeesPage from './pages/FeesPage'
import LoadingSpinner from './components/ui/LoadingSpinner'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <SimpleLoginPage />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cases/:caseId" element={<CaseDetailPage />} />
      <Route path="/fees" element={<FeesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

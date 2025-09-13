import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import LawyerHeader from '../components/layout/LawyerHeader'
import ClientHeader from '../components/layout/ClientHeader'
import JudgeHeader from '../components/layout/JudgeHeader'
import LawyerDashboard from '../components/dashboard/LawyerDashboard'
import ProfessionalClientDashboard from '../components/dashboard/ProfessionalClientDashboard'
import ProfessionalJudgeDashboard from '../components/dashboard/ProfessionalJudgeDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()

  const renderDashboard = () => {
    switch (user?.role) {
      case 'LAWYER':
        return <LawyerDashboard />
      case 'CLIENT':
        return <ProfessionalClientDashboard />
      case 'JUDGE':
        return <ProfessionalJudgeDashboard />
      default:
        return <div>Unknown role</div>
    }
  }

  const renderHeader = () => {
    switch (user?.role) {
      case 'LAWYER':
        return <LawyerHeader />
      case 'CLIENT':
        return <ClientHeader />
      case 'JUDGE':
        return <JudgeHeader />
      default:
        return null
    }
  }

  // All roles now use header-based layout with consistent background
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faedcd' }}>
      {renderHeader()}
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {renderDashboard()}
        </div>
      </main>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { formatDate, getUrgencyColor, getStatusColor } from '../../lib/utils'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Gavel,
  Users,
  Eye,
  Bot,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Shield,
  Scale
} from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import ChatBot from '../ChatBot'
import toast from 'react-hot-toast'

interface Case {
  id: string
  caseNumber: string
  title: string
  type: string
  subtype: string
  status: string
  urgency: string
  hearingDate: string
  lawyer: {
    id: string
    name: string
    barId: string
  }
  client: {
    id: string
    name: string
  }
  documents: Array<{
    id: string
    fileName: string
    documentType: string
    sharedWithJudgeAt: string
    extractedText?: string
  }>
  _count: {
    documents: {
      where: {
        isSharedWithJudge: boolean
      }
    }
  }
}

interface DashboardStats {
  totalCases: number
  activeCases: number
  pendingCases: number
  completedCases: number
  todayHearings: number
  urgentCases: number
}

export default function JudgeDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch judge's cases
  const { data: cases, isLoading: casesLoading, refetch: refetchCases } = useQuery(
    ['judge-cases', user?.id],
    async () => {
      const response = await api.get(`/cases/judge/${user?.id}`)
      return response.data.cases
    },
    { enabled: !!user?.id }
  )

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['judge-stats', user?.id],
    async () => {
      const response = await api.get(`/analytics/dashboard`)
      return response.data.analytics
    },
    { enabled: !!user?.id }
  )

  // Fetch system analytics
  const { data: systemStats } = useQuery(
    ['system-stats'],
    async () => {
      const response = await api.get('/analytics/system')
      return response.data
    }
  )

  const handleCaseSelect = (caseData: Case) => {
    setSelectedCase(caseData)
    setShowChatbot(true)
  }

  const handleUpdateCaseStatus = async (caseId: string, status: string) => {
    try {
      await api.put(`/cases/${caseId}/status`, { status })
      refetchCases()
      toast.success('Case status updated successfully')
    } catch (error) {
      toast.error('Failed to update case status')
    }
  }

  const stats = [
    {
      title: 'Total Cases',
      value: stats?.totalCases || 0,
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Cases',
      value: stats?.activeCases || 0,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      title: 'Today\'s Hearings',
      value: stats?.todayHearings || 0,
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      title: 'Urgent Cases',
      value: stats?.urgentCases || 0,
      change: '-2',
      changeType: 'negative',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ]

  if (casesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl shadow-lg border p-8" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
            <p className="text-lg text-gray-600">Manage your cases and oversee the judicial process</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Scale className="h-5 w-5 mr-2" />
              Schedule Hearing
            </button>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg"
            >
              <Bot className="h-5 w-5 mr-2" />
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="rounded-2xl shadow-lg border p-8 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="rounded-2xl shadow-lg border" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="border-b" style={{ borderColor: '#ddb892' }}>
          <nav className="-mb-px flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'cases', name: 'Cases' },
              { id: 'hearings', name: 'Hearings' },
              { id: 'analytics', name: 'Analytics' },
              { id: 'ai-research', name: 'AI Research' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Cases */}
                      <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cases</h3>
                  <div className="space-y-3">
                    {cases?.slice(0, 3).map((caseData) => (
                      <div key={caseData.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{caseData.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(caseData.urgency)}`}>
                              {caseData.urgency}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Case #{caseData.caseNumber}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
                            {caseData.status}
                          </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCaseSelect(caseData)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Analyze
                          </button>
                          <button
                            onClick={() => handleUpdateCaseStatus(caseData.id, 'IN_PROGRESS')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Scale className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Schedule Hearing</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Schedule a new court hearing</p>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Schedule Now
                      </button>
                    </div>

                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Bot className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">AI Case Analysis</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Get AI-powered case insights</p>
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        Analyze Case
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Cases</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                    />
                  </div>
                  <button className="p-2 border rounded-lg" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#ddb892'} onMouseLeave={(e) => e.target.style.backgroundColor = '#faedcd'}>
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                      {cases?.map((caseData) => (
                  <div key={caseData.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{caseData.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(caseData.urgency)}`}>
                        {caseData.urgency}
                      </span>
                            </div>
                    <p className="text-sm text-gray-600 mb-2">Case #{caseData.caseNumber} • {caseData.lawyer.name} • {caseData.client.name}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
                              {caseData.status}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCaseSelect(caseData)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                          Analyze
                              </button>
                              <button
                                onClick={() => handleUpdateCaseStatus(caseData.id, 'IN_PROGRESS')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                          Start
                              </button>
                            </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hearings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Hearings</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Hearing
                </button>
              </div>
              <div className="space-y-3">
                {cases?.filter(c => c.hearingDate).map((caseData) => (
                  <div key={caseData.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{caseData.title}</h4>
                      <span className="text-sm text-gray-500">{formatDate(caseData.hearingDate)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Case #{caseData.caseNumber}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{caseData.lawyer.name} • {caseData.client.name}</span>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Start Hearing
                      </button>
                    </div>
                </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Criminal Cases</span>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Civil Cases</span>
                      <span className="text-sm font-medium text-gray-900">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Family Cases</span>
                      <span className="text-sm font-medium text-gray-900">20%</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Cases</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.totalCases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Cases</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.activeCases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Law Firms</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.totalLawFirms || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-research' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Research Assistant</h3>
                <p className="text-gray-600 mb-6">Get instant legal research, case analysis, and judicial insights</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Case Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">Analyze case documents and get insights on legal precedents</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Start Analysis
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Research</h4>
                  <p className="text-sm text-gray-600 mb-4">Search through legal databases and get relevant case laws</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Start Research
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Judicial Insights</h4>
                  <p className="text-sm text-gray-600 mb-4">Get AI-powered insights for judicial decision making</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Insights
                  </button>
                </div>
              </div>

              <div className="rounded-lg p-6" style={{ backgroundColor: '#ddb892' }}>
                <h4 className="font-semibold text-gray-900 mb-4">Quick AI Queries</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "What are the recent amendments to the Consumer Protection Act?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "Find similar cases to property dispute in Delhi High Court"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "Analyze the legal precedents for breach of contract cases"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case-specific Chatbot */}
      {showChatbot && selectedCase && (
        <ChatBot 
          caseId={selectedCase.id}
          documents={selectedCase.documents}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  )
}
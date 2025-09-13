import { useState, useEffect } from 'react'
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
  Scale,
  Languages
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
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  
  // Translation dictionary
  const translations = {
    en: {
      welcomeBack: 'Welcome back',
      manageCases: 'Manage your cases and oversee the judicial process',
      scheduleHearing: 'Schedule Hearing',
      aiAssistant: 'AI Assistant',
      totalCases: 'Total Cases',
      activeCases: 'Active Cases',
      todayHearings: 'Today\'s Hearings',
      urgentCases: 'Urgent Cases',
      fromLastMonth: 'from last month',
      overview: 'Overview',
      cases: 'Cases',
      hearings: 'Hearings',
      analytics: 'Analytics',
      aiResearch: 'AI Research',
      recentCases: 'Recent Cases',
      quickActions: 'Quick Actions',
      scheduleNewHearing: 'Schedule a new court hearing',
      scheduleNow: 'Schedule Now',
      aiCaseAnalysis: 'AI Case Analysis',
      getAiInsights: 'Get AI-powered case insights',
      analyzeCase: 'Analyze Case',
      allCases: 'All Cases',
      searchCases: 'Search cases...',
      analyze: 'Analyze',
      start: 'Start',
      scheduledHearings: 'Scheduled Hearings',
      startHearing: 'Start Hearing',
      caseDistribution: 'Case Distribution',
      criminalCases: 'Criminal Cases',
      civilCases: 'Civil Cases',
      familyCases: 'Family Cases',
      systemOverview: 'System Overview',
      totalUsers: 'Total Users',
      lawFirms: 'Law Firms',
      aiResearchAssistant: 'AI Research Assistant',
      getInstantResearch: 'Get instant legal research, case analysis, and judicial insights',
      caseAnalysis: 'Case Analysis',
      analyzeCaseDocuments: 'Analyze case documents and get insights on legal precedents',
      startAnalysis: 'Start Analysis',
      legalResearch: 'Legal Research',
      searchLegalDatabases: 'Search through legal databases and get relevant case laws',
      startResearch: 'Start Research',
      judicialInsights: 'Judicial Insights',
      getAiInsightsJudicial: 'Get AI-powered insights for judicial decision making',
      getInsights: 'Get Insights',
      quickAiQueries: 'Quick AI Queries',
      consumerProtectionAct: 'What are the recent amendments to the Consumer Protection Act?',
      propertyDisputeDelhi: 'Find similar cases to property dispute in Delhi High Court',
      breachOfContract: 'Analyze the legal precedents for breach of contract cases',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      underReview: 'Under Review',
      inProgress: 'In Progress',
      completed: 'Completed',
      pending: 'Pending'
    },
    hi: {
      welcomeBack: 'वापस स्वागत है',
      manageCases: 'अपने मामलों का प्रबंधन करें और न्यायिक प्रक्रिया की देखरेख करें',
      scheduleHearing: 'सुनवाई निर्धारित करें',
      aiAssistant: 'एआई सहायक',
      totalCases: 'कुल मामले',
      activeCases: 'सक्रिय मामले',
      todayHearings: 'आज की सुनवाई',
      urgentCases: 'जरूरी मामले',
      fromLastMonth: 'पिछले महीने से',
      overview: 'अवलोकन',
      cases: 'मामले',
      hearings: 'सुनवाई',
      analytics: 'विश्लेषण',
      aiResearch: 'एआई अनुसंधान',
      recentCases: 'हाल के मामले',
      quickActions: 'त्वरित कार्य',
      scheduleNewHearing: 'एक नई अदालती सुनवाई निर्धारित करें',
      scheduleNow: 'अभी निर्धारित करें',
      aiCaseAnalysis: 'एआई मामला विश्लेषण',
      getAiInsights: 'एआई-संचालित मामला अंतर्दृष्टि प्राप्त करें',
      analyzeCase: 'मामला विश्लेषण करें',
      allCases: 'सभी मामले',
      searchCases: 'मामले खोजें...',
      analyze: 'विश्लेषण करें',
      start: 'शुरू करें',
      scheduledHearings: 'निर्धारित सुनवाई',
      startHearing: 'सुनवाई शुरू करें',
      caseDistribution: 'मामला वितरण',
      criminalCases: 'आपराधिक मामले',
      civilCases: 'दीवानी मामले',
      familyCases: 'पारिवारिक मामले',
      systemOverview: 'सिस्टम अवलोकन',
      totalUsers: 'कुल उपयोगकर्ता',
      lawFirms: 'कानूनी फर्म',
      aiResearchAssistant: 'एआई अनुसंधान सहायक',
      getInstantResearch: 'तुरंत कानूनी अनुसंधान, मामला विश्लेषण और न्यायिक अंतर्दृष्टि प्राप्त करें',
      caseAnalysis: 'मामला विश्लेषण',
      analyzeCaseDocuments: 'मामला दस्तावेजों का विश्लेषण करें और कानूनी नजीरों पर अंतर्दृष्टि प्राप्त करें',
      startAnalysis: 'विश्लेषण शुरू करें',
      legalResearch: 'कानूनी अनुसंधान',
      searchLegalDatabases: 'कानूनी डेटाबेस में खोजें और प्रासंगिक मामला कानून प्राप्त करें',
      startResearch: 'अनुसंधान शुरू करें',
      judicialInsights: 'न्यायिक अंतर्दृष्टि',
      getAiInsightsJudicial: 'न्यायिक निर्णय लेने के लिए एआई-संचालित अंतर्दृष्टि प्राप्त करें',
      getInsights: 'अंतर्दृष्टि प्राप्त करें',
      quickAiQueries: 'त्वरित एआई प्रश्न',
      consumerProtectionAct: 'उपभोक्ता संरक्षण अधिनियम में हाल के संशोधन क्या हैं?',
      propertyDisputeDelhi: 'दिल्ली उच्च न्यायालय में संपत्ति विवाद के समान मामले खोजें',
      breachOfContract: 'अनुबंध भंग के मामलों के लिए कानूनी नजीरों का विश्लेषण करें',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      underReview: 'समीक्षा के तहत',
      inProgress: 'प्रगति में',
      completed: 'पूर्ण',
      pending: 'लंबित'
    }
  }
  
  // Get current translation
  const t = translations[language]
  
  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('judge-dashboard-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

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
      title: t.totalCases,
      value: stats?.totalCases || 0,
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: t.activeCases,
      value: stats?.activeCases || 0,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      title: t.todayHearings,
      value: stats?.todayHearings || 0,
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      title: t.urgentCases,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.welcomeBack}, {user?.name}</h1>
            <p className="text-lg text-gray-600">{t.manageCases}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Scale className="h-5 w-5 mr-2" />
              {t.scheduleHearing}
            </button>
            <button
              onClick={() => setShowChatbot(!showChatbot)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg"
            >
              <Bot className="h-5 w-5 mr-2" />
              {t.aiAssistant}
            </button>
            <button
              onClick={() => {
                const newLanguage = language === 'en' ? 'hi' : 'en'
                setLanguage(newLanguage)
                localStorage.setItem('judge-dashboard-language', newLanguage)
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Languages className="h-5 w-5 mr-2" />
              {language === 'en' ? 'हिन्दी' : 'English'}
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
                    {stat.change} {t.fromLastMonth}
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
              { id: 'overview', name: t.overview },
              { id: 'cases', name: t.cases },
              { id: 'hearings', name: t.hearings },
              { id: 'analytics', name: t.analytics },
              { id: 'ai-research', name: t.aiResearch }
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.recentCases}</h3>
                  <div className="space-y-3">
                    {cases?.slice(0, 3).map((caseData) => (
                      <div key={caseData.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{caseData.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(caseData.urgency)}`}>
                              {caseData.urgency === 'High' ? t.high : caseData.urgency === 'Medium' ? t.medium : t.low}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Case #{caseData.caseNumber}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
                            {caseData.status === 'Under Review' ? t.underReview : caseData.status === 'In Progress' ? t.inProgress : t.completed}
                          </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCaseSelect(caseData)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {t.analyze}
                          </button>
                          <button
                            onClick={() => handleUpdateCaseStatus(caseData.id, 'IN_PROGRESS')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            {t.start}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions}</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Scale className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{t.scheduleHearing}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{t.scheduleNewHearing}</p>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        {t.scheduleNow}
                      </button>
                    </div>

                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Bot className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{t.aiCaseAnalysis}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{t.getAiInsights}</p>
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                        {t.analyzeCase}
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
                <h3 className="text-lg font-semibold text-gray-900">{t.allCases}</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.searchCases}
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
                        {caseData.urgency === 'High' ? t.high : caseData.urgency === 'Medium' ? t.medium : t.low}
                      </span>
                            </div>
                    <p className="text-sm text-gray-600 mb-2">Case #{caseData.caseNumber} • {caseData.lawyer.name} • {caseData.client.name}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}`}>
                              {caseData.status === 'Under Review' ? t.underReview : caseData.status === 'In Progress' ? t.inProgress : t.completed}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCaseSelect(caseData)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                          {t.analyze}
                              </button>
                              <button
                                onClick={() => handleUpdateCaseStatus(caseData.id, 'IN_PROGRESS')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                          {t.start}
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
                <h3 className="text-lg font-semibold text-gray-900">{t.scheduledHearings}</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.scheduleHearing}
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
                        {t.startHearing}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.caseDistribution}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.criminalCases}</span>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.civilCases}</span>
                      <span className="text-sm font-medium text-gray-900">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.familyCases}</span>
                      <span className="text-sm font-medium text-gray-900">20%</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.systemOverview}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.totalCases}</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.totalCases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.activeCases}</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.activeCases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.totalUsers}</span>
                      <span className="text-sm font-medium text-gray-900">{systemStats?.overview?.totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t.lawFirms}</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.aiResearchAssistant}</h3>
                <p className="text-gray-600 mb-6">{t.getInstantResearch}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.caseAnalysis}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.analyzeCaseDocuments}</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    {t.startAnalysis}
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.legalResearch}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.searchLegalDatabases}</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    {t.startResearch}
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.judicialInsights}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.getAiInsightsJudicial}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t.getInsights}
                  </button>
                </div>
              </div>

              <div className="rounded-lg p-6" style={{ backgroundColor: '#ddb892' }}>
                <h4 className="font-semibold text-gray-900 mb-4">{t.quickAiQueries}</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.consumerProtectionAct}"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.propertyDisputeDelhi}"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.breachOfContract}"
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
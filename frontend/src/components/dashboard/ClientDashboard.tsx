import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { formatDate, getUrgencyColor, getStatusColor } from '../../lib/utils'
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  Calendar,
  Phone,
  Plus,
  Search,
  Bot,
  MessageSquare,
  Shield,
  Languages
} from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

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
  judge: {
    id: string
    name: string
  }
  documentRequests: Array<{
    id: string
    documentType: string
    description: string
    isCompleted: boolean
    requestedAt: string
  }>
  _count: {
    documents: number
  }
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Language state
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  
  // Translation dictionary
  const translations = {
    en: {
      welcomeBack: 'Welcome back',
      trackProgress: 'Track your case progress and manage your legal matters',
      uploadDocument: 'Upload Document',
      contactLawyer: 'Contact Lawyer',
      activeCases: 'Active Cases',
      documentsUploaded: 'Documents Uploaded',
      pendingRequests: 'Pending Requests',
      daysToHearing: 'Days to Hearing',
      fromLastWeek: 'from last week',
      overview: 'Overview',
      documents: 'Documents',
      requests: 'Requests',
      timeline: 'Timeline',
      support: 'Support',
      yourCase: 'Your Case',
      yourLawyer: 'Your Lawyer',
      assignedJudge: 'Assigned Judge',
      nextHearing: 'Next Hearing',
      quickActions: 'Quick Actions',
      uploadDocuments: 'Upload Documents',
      uploadCaseDocuments: 'Upload case-related documents',
      uploadFiles: 'Upload Files',
      contactLawyerAction: 'Contact Lawyer',
      getInTouch: 'Get in touch with your lawyer',
      sendMessage: 'Send Message',
      noActiveCase: 'No Active Case',
      noActiveCaseDesc: 'You don\'t have any active cases at the moment.',
      contactALawyer: 'Contact a Lawyer',
      yourDocuments: 'Your Documents',
      caseDocuments: 'Case Documents',
      filesUploaded: 'files uploaded',
      viewAll: 'View All',
      noDocumentsYet: 'No Documents Yet',
      uploadFirstDocument: 'Upload your case documents to get started',
      uploadFirstDocumentBtn: 'Upload First Document',
      documentRequests: 'Document Requests',
      searchRequests: 'Search requests...',
      requestedOn: 'Requested on',
      upload: 'Upload',
      allCaughtUp: 'All Caught Up!',
      noPendingRequests: 'No pending document requests at the moment.',
      caseTimeline: 'Case Timeline',
      caseCreated: 'Case Created',
      caseFiled: 'Case was filed and assigned to your lawyer',
      documentsUploadedTimeline: 'Documents Uploaded',
      documentsRequested: 'Document Requests',
      documentsRequestedByLawyer: 'documents requested by lawyer',
      upcomingHearing: 'Upcoming Hearing',
      scheduledFor: 'Scheduled for',
      clientSupport: 'Client Support',
      getHelp: 'Get help with your case and legal matters',
      emergencyContact: 'Emergency Contact',
      emergencySupport: '24/7 emergency legal support',
      callNow: 'Call Now',
      aiAssistant: 'AI Assistant',
      instantAnswers: 'Get instant answers to legal questions',
      askAI: 'Ask AI',
      faq: 'Frequently Asked Questions',
      howToUpload: 'How do I upload documents for my case?',
      whenNextHearing: 'When is my next court hearing?',
      howToContact: 'How can I contact my lawyer?',
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
      trackProgress: 'अपने मामले की प्रगति को ट्रैक करें और अपने कानूनी मामलों का प्रबंधन करें',
      uploadDocument: 'दस्तावेज अपलोड करें',
      contactLawyer: 'वकील से संपर्क करें',
      activeCases: 'सक्रिय मामले',
      documentsUploaded: 'अपलोड किए गए दस्तावेज',
      pendingRequests: 'लंबित अनुरोध',
      daysToHearing: 'सुनवाई तक दिन',
      fromLastWeek: 'पिछले सप्ताह से',
      overview: 'अवलोकन',
      documents: 'दस्तावेज',
      requests: 'अनुरोध',
      timeline: 'समयरेखा',
      support: 'सहायता',
      yourCase: 'आपका मामला',
      yourLawyer: 'आपके वकील',
      assignedJudge: 'नियुक्त न्यायाधीश',
      nextHearing: 'अगली सुनवाई',
      quickActions: 'त्वरित कार्य',
      uploadDocuments: 'दस्तावेज अपलोड करें',
      uploadCaseDocuments: 'मामले से संबंधित दस्तावेज अपलोड करें',
      uploadFiles: 'फाइलें अपलोड करें',
      contactLawyerAction: 'वकील से संपर्क करें',
      getInTouch: 'अपने वकील से संपर्क करें',
      sendMessage: 'संदेश भेजें',
      noActiveCase: 'कोई सक्रिय मामला नहीं',
      noActiveCaseDesc: 'इस समय आपके पास कोई सक्रिय मामला नहीं है।',
      contactALawyer: 'वकील से संपर्क करें',
      yourDocuments: 'आपके दस्तावेज',
      caseDocuments: 'मामले के दस्तावेज',
      filesUploaded: 'फाइलें अपलोड की गईं',
      viewAll: 'सभी देखें',
      noDocumentsYet: 'अभी तक कोई दस्तावेज नहीं',
      uploadFirstDocument: 'शुरू करने के लिए अपने मामले के दस्तावेज अपलोड करें',
      uploadFirstDocumentBtn: 'पहला दस्तावेज अपलोड करें',
      documentRequests: 'दस्तावेज अनुरोध',
      searchRequests: 'अनुरोध खोजें...',
      requestedOn: 'पर अनुरोध किया गया',
      upload: 'अपलोड करें',
      allCaughtUp: 'सब कुछ अपडेट!',
      noPendingRequests: 'इस समय कोई लंबित दस्तावेज अनुरोध नहीं।',
      caseTimeline: 'मामले की समयरेखा',
      caseCreated: 'मामला बनाया गया',
      caseFiled: 'मामला दायर किया गया और आपके वकील को सौंपा गया',
      documentsUploadedTimeline: 'दस्तावेज अपलोड किए गए',
      documentsRequested: 'दस्तावेज अनुरोध',
      documentsRequestedByLawyer: 'वकील द्वारा अनुरोधित दस्तावेज',
      upcomingHearing: 'आगामी सुनवाई',
      scheduledFor: 'के लिए निर्धारित',
      clientSupport: 'ग्राहक सहायता',
      getHelp: 'अपने मामले और कानूनी मामलों में मदद प्राप्त करें',
      emergencyContact: 'आपातकालीन संपर्क',
      emergencySupport: '24/7 आपातकालीन कानूनी सहायता',
      callNow: 'अभी कॉल करें',
      aiAssistant: 'एआई सहायक',
      instantAnswers: 'कानूनी सवालों के तुरंत जवाब प्राप्त करें',
      askAI: 'एआई से पूछें',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      howToUpload: 'मैं अपने मामले के लिए दस्तावेज कैसे अपलोड करूं?',
      whenNextHearing: 'मेरी अगली अदालती सुनवाई कब है?',
      howToContact: 'मैं अपने वकील से कैसे संपर्क कर सकता हूं?',
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
    const savedLanguage = localStorage.getItem('lawyer-dashboard-language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const { data: cases, isLoading } = useQuery<Case[]>(
    ['client-cases', user?.id],
    async () => {
      const response = await api.get(`/cases/client/${user?.id}`)
      return response.data.cases
    },
    {
      enabled: !!user?.id,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const currentCase = cases?.[0] // Assuming client has one active case
  const pendingRequests = currentCase?.documentRequests.filter(r => !r.isCompleted) || []

  // Mock stats for client dashboard
  const stats = [
    {
      title: t.activeCases,
      value: cases?.length || '0',
      change: '+1',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: t.documentsUploaded,
      value: currentCase?._count.documents || '0',
      change: '+3',
      changeType: 'positive',
      icon: Upload,
      color: 'bg-green-500'
    },
    {
      title: t.pendingRequests,
      value: pendingRequests.length.toString(),
      change: '-1',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: t.daysToHearing,
      value: currentCase?.hearingDate ? '15' : 'N/A',
      change: '-2',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500'
    }
  ]

  if (isLoading) {
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
            <p className="text-lg text-gray-600">{t.trackProgress}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Upload className="h-5 w-5 mr-2" />
              {t.uploadDocument}
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              {t.contactLawyer}
            </button>
            <button
              onClick={() => {
                const newLanguage = language === 'en' ? 'hi' : 'en'
                setLanguage(newLanguage)
                localStorage.setItem('lawyer-dashboard-language', newLanguage)
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
                    {stat.change} {t.fromLastWeek}
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
              { id: 'documents', name: t.documents },
              { id: 'requests', name: t.requests },
              { id: 'timeline', name: t.timeline },
              { id: 'support', name: t.support }
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
              {currentCase ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Case Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.yourCase}</h3>
                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{currentCase.caseNumber}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(currentCase.urgency)}`}>
                          {currentCase.urgency === 'High' ? t.high : currentCase.urgency === 'Medium' ? t.medium : t.low}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(currentCase.status)}`}>
                          {currentCase.status === 'Under Review' ? t.underReview : currentCase.status === 'In Progress' ? t.inProgress : t.completed}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{currentCase.title}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t.yourLawyer}</p>
                          <p className="text-sm text-gray-600">{currentCase.lawyer.name}</p>
                          <p className="text-xs text-gray-500">Bar ID: {currentCase.lawyer.barId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t.assignedJudge}</p>
                          <p className="text-sm text-gray-600">{currentCase.judge.name}</p>
                        </div>
                        {currentCase.hearingDate && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">{t.nextHearing}</p>
                            <p className="text-sm text-gray-600">{formatDate(currentCase.hearingDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions}</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Upload className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="font-medium text-gray-900">{t.uploadDocuments}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{t.uploadCaseDocuments}</p>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                          {t.uploadFiles}
                        </button>
                      </div>

                      <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <h4 className="font-medium text-gray-900">{t.contactLawyerAction}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{t.getInTouch}</p>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                          {t.sendMessage}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noActiveCase}</h3>
                  <p className="text-gray-600 mb-6">{t.noActiveCaseDesc}</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    {t.contactALawyer}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.yourDocuments}</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.uploadDocument}
                </button>
              </div>
              <div className="space-y-3">
                {(currentCase?._count.documents || 0) > 0 ? (
                  <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{t.caseDocuments}</h4>
                          <p className="text-sm text-gray-600">{currentCase?._count.documents || 0} {t.filesUploaded}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        {t.viewAll}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t.noDocumentsYet}</h4>
                    <p className="text-gray-600 mb-4">{t.uploadFirstDocument}</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      {t.uploadFirstDocumentBtn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.documentRequests}</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.searchRequests}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-yellow-100 p-2 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{request.documentType}</h4>
                            {request.description && (
                              <p className="text-sm text-gray-600">{request.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {t.requestedOn} {formatDate(request.requestedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>{t.upload}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t.allCaughtUp}</h4>
                    <p className="text-gray-600">{t.noPendingRequests}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.caseTimeline}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.caseCreated}</p>
                    <p className="text-xs text-gray-500">{t.caseFiled}</p>
                  </div>
                </div>
                
                {(currentCase?._count.documents || 0) > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.documentsUploadedTimeline}</p>
                      <p className="text-xs text-gray-500">{currentCase?._count.documents || 0} {t.filesUploaded}</p>
                    </div>
                  </div>
                )}

                {pendingRequests.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.documentsRequested}</p>
                      <p className="text-xs text-gray-500">{pendingRequests.length} {t.documentsRequestedByLawyer}</p>
                    </div>
                  </div>
                )}

                {currentCase?.hearingDate && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.upcomingHearing}</p>
                      <p className="text-xs text-gray-500">{t.scheduledFor} {formatDate(currentCase.hearingDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.clientSupport}</h3>
                <p className="text-gray-600 mb-6">{t.getHelp}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.contactLawyerAction}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.getInTouch}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    {t.sendMessage}
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.emergencyContact}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.emergencySupport}</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    {t.callNow}
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <Bot className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.aiAssistant}</h4>
                  <p className="text-sm text-gray-600 mb-4">{t.instantAnswers}</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    {t.askAI}
                  </button>
                </div>
              </div>

              <div className="rounded-lg p-6" style={{ backgroundColor: '#ddb892' }}>
                <h4 className="font-semibold text-gray-900 mb-4">{t.faq}</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.howToUpload}"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.whenNextHearing}"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "{t.howToContact}"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

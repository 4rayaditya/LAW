import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  Gavel,
  BookOpen,
  BarChart3,
  MessageSquare,
  Eye,
  Download,
  Filter,
  Search,
  Upload,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react'

export default function ProfessionalClientDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  
  // Translation dictionary
  const translations = {
    en: {
      clientDashboard: 'Client Dashboard',
      welcomeBack: 'Welcome back',
      myCases: 'My Cases',
      activeCases: 'Active Cases',
      upcomingHearings: 'Upcoming Hearings',
      documentsShared: 'Documents Shared',
      fromLastMonth: 'from last month',
      overview: 'Overview',
      cases: 'My Cases',
      documents: 'Documents',
      lawyer: 'My Lawyer',
      support: 'Support',
      allMyCases: 'All My Cases',
      searchCases: 'Search cases...',
      filter: 'Filter',
      case: 'Case',
      type: 'Type',
      status: 'Status',
      lawyerName: 'Lawyer',
      progress: 'Progress',
      actions: 'Actions',
      myDocuments: 'My Documents',
      uploadDocument: 'Upload Document',
      download: 'Download',
      uploaded: 'Uploaded',
      myLawyer: 'My Lawyer',
      criminalLawSpecialist: 'Criminal Law Specialist',
      barId: 'Bar ID',
      callLawyer: 'Call Lawyer',
      sendMessage: 'Send Message',
      supportHelp: 'Support & Help',
      contactSupport: 'Contact Support',
      getHelp: 'Get help with your cases and legal questions.',
      legalResources: 'Legal Resources',
      accessLegal: 'Access legal guides and helpful resources.',
      viewResources: 'View Resources',
      complete: 'Complete',
      underReview: 'Under Review',
      documentsPending: 'Documents Pending',
      readyForHearing: 'Ready for Hearing',
      approved: 'Approved',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      criminal: 'Criminal',
      civil: 'Civil',
      family: 'Family'
    },
    hi: {
      clientDashboard: 'ग्राहक डैशबोर्ड',
      welcomeBack: 'वापस स्वागत है',
      myCases: 'मेरे मामले',
      activeCases: 'सक्रिय मामले',
      upcomingHearings: 'आगामी सुनवाई',
      documentsShared: 'साझा किए गए दस्तावेज',
      fromLastMonth: 'पिछले महीने से',
      overview: 'अवलोकन',
      cases: 'मेरे मामले',
      documents: 'दस्तावेज',
      lawyer: 'मेरे वकील',
      support: 'सहायता',
      allMyCases: 'मेरे सभी मामले',
      searchCases: 'मामले खोजें...',
      filter: 'फिल्टर',
      case: 'मामला',
      type: 'प्रकार',
      status: 'स्थिति',
      lawyerName: 'वकील',
      progress: 'प्रगति',
      actions: 'कार्य',
      myDocuments: 'मेरे दस्तावेज',
      uploadDocument: 'दस्तावेज अपलोड करें',
      download: 'डाउनलोड करें',
      uploaded: 'अपलोड किया गया',
      myLawyer: 'मेरे वकील',
      criminalLawSpecialist: 'आपराधिक कानून विशेषज्ञ',
      barId: 'बार आईडी',
      callLawyer: 'वकील को कॉल करें',
      sendMessage: 'संदेश भेजें',
      supportHelp: 'सहायता और मदद',
      contactSupport: 'सहायता से संपर्क करें',
      getHelp: 'अपने मामलों और कानूनी सवालों में मदद प्राप्त करें।',
      legalResources: 'कानूनी संसाधन',
      accessLegal: 'कानूनी गाइड और उपयोगी संसाधनों तक पहुंचें।',
      viewResources: 'संसाधन देखें',
      complete: 'पूर्ण',
      underReview: 'समीक्षा के तहत',
      documentsPending: 'दस्तावेज लंबित',
      readyForHearing: 'सुनवाई के लिए तैयार',
      approved: 'अनुमोदित',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      criminal: 'आपराधिक',
      civil: 'दीवानी',
      family: 'पारिवारिक'
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

  const stats = [
    {
      title: t.myCases,
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: t.activeCases,
      value: '2',
      change: '0',
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: t.upcomingHearings,
      value: '1',
      change: '+1',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: t.documentsShared,
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: Upload,
      color: 'bg-green-500'
    }
  ]

  const myCases = [
    {
      id: '1',
      caseNumber: 'CR-2024-001',
      title: language === 'hi' ? 'राज्य बनाम राजेश कुमार' : 'State vs. Rajesh Kumar',
      type: t.criminal,
      urgency: t.high,
      hearingDate: '2024-01-15',
      status: t.underReview,
      lawyer: 'Adv. Priya Sharma',
      progress: 75,
      lastUpdate: '2024-01-10'
    },
    {
      id: '2',
      caseNumber: 'CR-2024-002',
      title: language === 'hi' ? 'संपत्ति विवाद - शर्मा बनाम गुप्ता' : 'Property Dispute - Sharma vs. Gupta',
      type: t.civil,
      urgency: t.medium,
      hearingDate: '2024-01-18',
      status: t.documentsPending,
      lawyer: 'Adv. Amit Singh',
      progress: 45,
      lastUpdate: '2024-01-08'
    },
    {
      id: '3',
      caseNumber: 'CR-2024-003',
      title: language === 'hi' ? 'तलाक याचिका - मेहता मामला' : 'Divorce Petition - Mehta Case',
      type: t.family,
      urgency: t.low,
      hearingDate: '2024-01-20',
      status: t.readyForHearing,
      lawyer: 'Adv. Sunita Reddy',
      progress: 90,
      lastUpdate: '2024-01-12'
    }
  ]

  const recentDocuments = [
    {
      id: '1',
      name: language === 'hi' ? 'एफआईआर कॉपी - मामला CR-2024-001' : 'FIR Copy - Case CR-2024-001',
      type: 'FIR',
      uploadedAt: '2024-01-10',
      status: t.approved,
      size: '2.3 MB'
    },
    {
      id: '2',
      name: language === 'hi' ? 'चिकित्सा रिपोर्ट - चोट मूल्यांकन' : 'Medical Report - Injury Assessment',
      type: language === 'hi' ? 'चिकित्सा रिपोर्ट' : 'Medical Report',
      uploadedAt: '2024-01-08',
      status: t.underReview,
      size: '1.8 MB'
    },
    {
      id: '3',
      name: language === 'hi' ? 'संपत्ति दस्तावेज - शर्मा बनाम गुप्ता' : 'Property Documents - Sharma vs. Gupta',
      type: language === 'hi' ? 'संपत्ति दस्तावेज' : 'Property Documents',
      uploadedAt: '2024-01-05',
      status: t.approved,
      size: '5.2 MB'
    }
  ]

  const getUrgencyColor = (urgency: string) => {
    if (urgency === t.high || urgency === 'High') return 'bg-red-100 text-red-800'
    if (urgency === t.medium || urgency === 'Medium') return 'bg-yellow-100 text-yellow-800'
    if (urgency === t.low || urgency === 'Low') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    if (status === t.underReview || status === 'Under Review') return 'bg-blue-100 text-blue-800'
    if (status === t.documentsPending || status === 'Documents Pending') return 'bg-yellow-100 text-yellow-800'
    if (status === t.readyForHearing || status === 'Ready for Hearing') return 'bg-green-100 text-green-800'
    if (status === t.approved || status === 'Approved') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl shadow-lg border p-8" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.clientDashboard}</h1>
            <p className="text-lg text-gray-600">{t.welcomeBack}, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Client</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
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
        <div className="border-b p-6" style={{ borderColor: '#ddb892' }}>
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: t.overview, icon: BarChart3 },
              { id: 'cases', name: t.cases, icon: FileText },
              { id: 'documents', name: t.documents, icon: Upload },
              { id: 'lawyer', name: t.lawyer, icon: Gavel },
              { id: 'support', name: t.support, icon: MessageCircle }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Cases */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.myCases}</h3>
                  <div className="space-y-3">
                    {myCases.slice(0, 2).map((case_) => (
                      <div key={case_.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{case_.caseNumber}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(case_.urgency)}`}>
                            {case_.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{case_.title}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{case_.type}</span>
                          <span>{case_.hearingDate}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${case_.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{case_.progress}% {t.complete}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
                  <div className="space-y-3">
                    {recentDocuments.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{doc.type}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{doc.uploadedAt}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.allMyCases}</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.searchCases}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    {t.filter}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.case}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.type}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.lawyerName}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.progress}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{case_.caseNumber}</div>
                            <div className="text-sm text-gray-500">{case_.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.lawyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${case_.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{case_.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.myDocuments}</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  {t.uploadDocument}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                    <p className="text-xs text-gray-500 mb-4">{t.uploaded}: {doc.uploadedAt}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Download className="h-4 w-4 inline mr-1" />
                        {t.download}
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lawyer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.myLawyer}</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Gavel className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Adv. Priya Sharma</h4>
                    <p className="text-sm text-gray-600">{t.criminalLawSpecialist}</p>
                    <p className="text-xs text-gray-500">{t.barId}: BAR-2024-001</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">priya@lawfirm.com</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {t.callLawyer}
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 inline mr-2" />
                    {t.sendMessage}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.supportHelp}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <MessageCircle className="h-8 w-8 text-blue-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{t.contactSupport}</h4>
                  <p className="text-gray-600 mb-4">{t.getHelp}</p>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700">
                    {t.contactSupport}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <BookOpen className="h-8 w-8 text-green-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{t.legalResources}</h4>
                  <p className="text-gray-600 mb-4">{t.accessLegal}</p>
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700">
                    {t.viewResources}
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

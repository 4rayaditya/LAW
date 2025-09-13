import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { formatDate, getUrgencyColor, getStatusColor } from '../../lib/utils'
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Phone,
  Plus,
  Search,
  Filter,
  Bot,
  TrendingUp,
  MessageSquare,
  Shield
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
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: cases, isLoading, refetch } = useQuery<Case[]>(
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
      title: 'Active Cases',
      value: cases?.length || '0',
      change: '+1',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Documents Uploaded',
      value: currentCase?._count.documents || '0',
      change: '+3',
      changeType: 'positive',
      icon: Upload,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Requests',
      value: pendingRequests.length.toString(),
      change: '-1',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Days to Hearing',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
            <p className="text-lg text-gray-600">Track your case progress and manage your legal matters</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload Document
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Lawyer
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
                    {stat.change} from last week
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
              { id: 'documents', name: 'Documents' },
              { id: 'requests', name: 'Requests' },
              { id: 'timeline', name: 'Timeline' },
              { id: 'support', name: 'Support' }
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Case</h3>
                    <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{currentCase.caseNumber}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(currentCase.urgency)}`}>
                          {t('urgency.' + currentCase.urgency)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(currentCase.status)}`}>
                          {t('status.' + currentCase.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{currentCase.title}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Your Lawyer</p>
                          <p className="text-sm text-gray-600">{currentCase.lawyer.name}</p>
                          <p className="text-xs text-gray-500">Bar ID: {currentCase.lawyer.barId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Assigned Judge</p>
                          <p className="text-sm text-gray-600">{currentCase.judge.name}</p>
                        </div>
                        {currentCase.hearingDate && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Next Hearing</p>
                            <p className="text-sm text-gray-600">{formatDate(currentCase.hearingDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Upload className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="font-medium text-gray-900">Upload Documents</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Upload case-related documents</p>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                          Upload Files
                        </button>
                      </div>

                      <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <h4 className="font-medium text-gray-900">Contact Lawyer</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Get in touch with your lawyer</p>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Case</h3>
                  <p className="text-gray-600 mb-6">You don't have any active cases at the moment.</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Contact a Lawyer
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>
              <div className="space-y-3">
                {currentCase?._count.documents > 0 ? (
                  <div className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Case Documents</h4>
                          <p className="text-sm text-gray-600">{currentCase._count.documents} files uploaded</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h4>
                    <p className="text-gray-600 mb-4">Upload your case documents to get started</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      Upload First Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Requests</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
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
                              Requested on {formatDate(request.requestedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h4>
                    <p className="text-gray-600">No pending document requests at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Case Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Case Created</p>
                    <p className="text-xs text-gray-500">Case was filed and assigned to your lawyer</p>
                  </div>
                </div>
                
                {currentCase?._count.documents > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documents Uploaded</p>
                      <p className="text-xs text-gray-500">{currentCase._count.documents} documents uploaded</p>
                    </div>
                  </div>
                )}

                {pendingRequests.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Document Requests</p>
                      <p className="text-xs text-gray-500">{pendingRequests.length} documents requested by lawyer</p>
                    </div>
                  </div>
                )}

                {currentCase?.hearingDate && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upcoming Hearing</p>
                      <p className="text-xs text-gray-500">Scheduled for {formatDate(currentCase.hearingDate)}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Support</h3>
                <p className="text-gray-600 mb-6">Get help with your case and legal matters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Lawyer</h4>
                  <p className="text-sm text-gray-600 mb-4">Get in touch with your assigned lawyer</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send Message
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
                  <p className="text-sm text-gray-600 mb-4">24/7 emergency legal support</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Call Now
                  </button>
                </div>

                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <Bot className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Assistant</h4>
                  <p className="text-sm text-gray-600 mb-4">Get instant answers to legal questions</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Ask AI
                  </button>
                </div>
              </div>

              <div className="rounded-lg p-6" style={{ backgroundColor: '#ddb892' }}>
                <h4 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "How do I upload documents for my case?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "When is my next court hearing?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
                    "How can I contact my lawyer?"
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

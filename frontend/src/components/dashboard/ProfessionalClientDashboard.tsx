import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'My Cases',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Cases',
      value: '2',
      change: '0',
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Upcoming Hearings',
      value: '1',
      change: '+1',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Documents Shared',
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
      title: 'State vs. Rajesh Kumar',
      type: 'Criminal',
      urgency: 'High',
      hearingDate: '2024-01-15',
      status: 'Under Review',
      lawyer: 'Adv. Priya Sharma',
      progress: 75,
      lastUpdate: '2024-01-10'
    },
    {
      id: '2',
      caseNumber: 'CR-2024-002',
      title: 'Property Dispute - Sharma vs. Gupta',
      type: 'Civil',
      urgency: 'Medium',
      hearingDate: '2024-01-18',
      status: 'Documents Pending',
      lawyer: 'Adv. Amit Singh',
      progress: 45,
      lastUpdate: '2024-01-08'
    },
    {
      id: '3',
      caseNumber: 'CR-2024-003',
      title: 'Divorce Petition - Mehta Case',
      type: 'Family',
      urgency: 'Low',
      hearingDate: '2024-01-20',
      status: 'Ready for Hearing',
      lawyer: 'Adv. Sunita Reddy',
      progress: 90,
      lastUpdate: '2024-01-12'
    }
  ]

  const recentDocuments = [
    {
      id: '1',
      name: 'FIR Copy - Case CR-2024-001',
      type: 'FIR',
      uploadedAt: '2024-01-10',
      status: 'Approved',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Medical Report - Injury Assessment',
      type: 'Medical Report',
      uploadedAt: '2024-01-08',
      status: 'Under Review',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Property Documents - Sharma vs. Gupta',
      type: 'Property Documents',
      uploadedAt: '2024-01-05',
      status: 'Approved',
      size: '5.2 MB'
    }
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review': return 'bg-blue-100 text-blue-800'
      case 'Documents Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Ready for Hearing': return 'bg-green-100 text-green-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
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
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'cases', name: 'My Cases', icon: FileText },
              { id: 'documents', name: 'Documents', icon: Upload },
              { id: 'lawyer', name: 'My Lawyer', icon: Gavel },
              { id: 'support', name: 'Support', icon: MessageCircle }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">My Cases</h3>
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
                        <p className="text-xs text-gray-500 mt-1">{case_.progress}% Complete</p>
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
                <h3 className="text-lg font-semibold text-gray-900">All My Cases</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lawyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
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
                    <p className="text-xs text-gray-500 mb-4">Uploaded: {doc.uploadedAt}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Download className="h-4 w-4 inline mr-1" />
                        Download
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
              <h3 className="text-lg font-semibold text-gray-900">My Lawyer</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Gavel className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Adv. Priya Sharma</h4>
                    <p className="text-sm text-gray-600">Criminal Law Specialist</p>
                    <p className="text-xs text-gray-500">Bar ID: BAR-2024-001</p>
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
                    Call Lawyer
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 inline mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Support & Help</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <MessageCircle className="h-8 w-8 text-blue-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Contact Support</h4>
                  <p className="text-gray-600 mb-4">Get help with your cases and legal questions.</p>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700">
                    Contact Support
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <BookOpen className="h-8 w-8 text-green-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Legal Resources</h4>
                  <p className="text-gray-600 mb-4">Access legal guides and helpful resources.</p>
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700">
                    View Resources
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

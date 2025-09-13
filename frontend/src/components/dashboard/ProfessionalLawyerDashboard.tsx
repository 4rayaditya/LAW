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
  Plus,
  Upload,
  Send
} from 'lucide-react'

export default function ProfessionalLawyerDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Active Cases',
      value: '47',
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Clients',
      value: '23',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming Hearings',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Documents Pending',
      value: '8',
      change: '-2',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ]

  const recentCases = [
    {
      id: '1',
      caseNumber: 'CR-2024-001',
      title: 'State vs. Rajesh Kumar',
      type: 'Criminal',
      urgency: 'High',
      hearingDate: '2024-01-15',
      status: 'Under Review',
      client: 'Rajesh Kumar',
      progress: 75
    },
    {
      id: '2',
      caseNumber: 'CR-2024-002',
      title: 'Property Dispute - Sharma vs. Gupta',
      type: 'Civil',
      urgency: 'Medium',
      hearingDate: '2024-01-18',
      status: 'Documents Pending',
      client: 'Sharma Family',
      progress: 45
    },
    {
      id: '3',
      caseNumber: 'CR-2024-003',
      title: 'Divorce Petition - Mehta Case',
      type: 'Family',
      urgency: 'Low',
      hearingDate: '2024-01-20',
      status: 'Ready for Hearing',
      client: 'Mehta Family',
      progress: 90
    }
  ]

  const clients = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      cases: 2,
      lastContact: '2024-01-10'
    },
    {
      id: '2',
      name: 'Sharma Family',
      email: 'sharma@email.com',
      phone: '+91 98765 43211',
      cases: 1,
      lastContact: '2024-01-08'
    },
    {
      id: '3',
      name: 'Mehta Family',
      email: 'mehta@email.com',
      phone: '+91 98765 43212',
      cases: 1,
      lastContact: '2024-01-12'
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
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Gavel className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Advocate</p>
              <p className="text-xs text-gray-500">Bar ID: {user?.barId || 'BAR-2024-001'}</p>
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
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
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
              { id: 'clients', name: 'Clients', icon: Users },
              { id: 'documents', name: 'Documents', icon: Upload },
              { id: 'ai', name: 'AI Assistant', icon: MessageSquare }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
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
                {/* Recent Cases */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Cases</h3>
                    <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Case
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentCases.slice(0, 3).map((case_) => (
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
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${case_.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{case_.progress}% Complete</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Clients */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
                    <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clients.slice(0, 3).map((client) => (
                      <div key={client.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{client.name}</h4>
                          <span className="text-xs text-gray-500">{client.cases} cases</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                        <p className="text-xs text-gray-500">{client.phone}</p>
                        <div className="mt-2 flex space-x-2">
                          <button className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-xs font-medium hover:bg-green-700">
                            Contact
                          </button>
                          <button className="px-3 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">
                            View
                          </button>
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
                <h3 className="text-lg font-semibold text-gray-900">All Cases</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Case
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{case_.caseNumber}</div>
                            <div className="text-sm text-gray-500">{case_.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${case_.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{case_.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Send className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Clients</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <span className="text-xs text-gray-500">{client.cases} cases</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{client.phone}</p>
                    <p className="text-xs text-gray-500 mb-4">Last contact: {client.lastContact}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700">
                        Contact
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                        View Cases
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Management</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h4>
                <p className="text-gray-600 mb-4">
                  Upload case documents, evidence, and legal papers for review and sharing.
                </p>
                <button className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700">
                  Choose Files
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Legal Assistant</h4>
                <p className="text-gray-600 mb-4">
                  Get instant legal research, case analysis, and document insights powered by AI.
                </p>
                <button className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700">
                  Open AI Assistant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

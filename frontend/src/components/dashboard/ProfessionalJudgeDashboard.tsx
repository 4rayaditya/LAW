import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { 
  Scale, 
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
  Search
} from 'lucide-react'

export default function ProfessionalJudgeDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Total Cases',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Decisions',
      value: '89',
      change: '-5%',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed Cases',
      value: '1,158',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Upcoming Hearings',
      value: '23',
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500'
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
      lawyer: 'Adv. Priya Sharma',
      client: 'Rajesh Kumar'
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
      client: 'Sharma Family'
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
      client: 'Mehta Family'
    }
  ]

  const upcomingHearings = [
    {
      id: '1',
      time: '09:00 AM',
      case: 'State vs. Rajesh Kumar',
      type: 'Criminal',
      courtroom: 'Courtroom 1',
      lawyer: 'Adv. Priya Sharma'
    },
    {
      id: '2',
      time: '11:30 AM',
      case: 'Property Dispute - Sharma vs. Gupta',
      type: 'Civil',
      courtroom: 'Courtroom 2',
      lawyer: 'Adv. Amit Singh'
    },
    {
      id: '3',
      time: '02:00 PM',
      case: 'Divorce Petition - Mehta Case',
      type: 'Family',
      courtroom: 'Courtroom 1',
      lawyer: 'Adv. Sunita Reddy'
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Judge Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">Delhi High Court</p>
              <p className="text-sm text-gray-500">Justice {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'cases', name: 'My Cases', icon: FileText },
              { id: 'hearings', name: 'Hearings', icon: Calendar },
              { id: 'ai', name: 'AI Assistant', icon: MessageSquare }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cases</h3>
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
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{case_.type}</span>
                          <span>{case_.hearingDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Hearings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Hearings</h3>
                  <div className="space-y-3">
                    {upcomingHearings.map((hearing) => (
                      <div key={hearing.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{hearing.time}</span>
                          <span className="text-xs text-gray-500">{hearing.courtroom}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{hearing.case}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{hearing.type}</span>
                          <span>{hearing.lawyer}</span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hearing Date</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(case_.urgency)}`}>
                            {case_.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.hearingDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hearings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Hearings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingHearings.map((hearing) => (
                  <div key={hearing.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">{hearing.time}</span>
                      <span className="text-sm text-gray-500">{hearing.courtroom}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{hearing.case}</h4>
                    <p className="text-sm text-gray-600 mb-2">{hearing.type}</p>
                    <p className="text-sm text-gray-500">{hearing.lawyer}</p>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Start Hearing
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Case Analysis</h4>
                <p className="text-gray-600 mb-4">
                  Get instant insights, case summaries, and legal recommendations powered by AI.
                </p>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700">
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

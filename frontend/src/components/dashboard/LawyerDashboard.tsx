import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calculator, 
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react'

export default function LawyerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = [
    {
      title: 'Active Cases',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Clients',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: '₹2.4L',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Fees',
      value: '₹85K',
      change: '-5%',
      changeType: 'negative',
      icon: Calculator,
      color: 'bg-orange-500'
    }
  ]

  const recentCases = [
    {
      id: 'CASE-001',
      title: 'Property Dispute - Sharma vs Kumar',
      client: 'Rajesh Sharma',
      status: 'Active',
      nextHearing: '2024-01-15',
      priority: 'High'
    },
    {
      id: 'CASE-002',
      title: 'Contract Breach - TechCorp',
      client: 'TechCorp Pvt Ltd',
      status: 'Under Review',
      nextHearing: '2024-01-20',
      priority: 'Medium'
    },
    {
      id: 'CASE-003',
      title: 'Divorce Proceedings - Patel Family',
      client: 'Priya Patel',
      status: 'Active',
      nextHearing: '2024-01-18',
      priority: 'High'
    }
  ]

  const recentClients = [
    {
      id: 'CLI-001',
      name: 'Rajesh Sharma',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      cases: 2,
      lastContact: '2024-01-10'
    },
    {
      id: 'CLI-002',
      name: 'TechCorp Pvt Ltd',
      email: 'legal@techcorp.com',
      phone: '+91 98765 43211',
      cases: 1,
      lastContact: '2024-01-08'
    },
    {
      id: 'CLI-003',
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '+91 98765 43212',
      cases: 1,
      lastContact: '2024-01-12'
    }
  ]

  const expenses = [
    {
      id: 'EXP-001',
      description: 'Court Filing Fees',
      amount: 2500,
      date: '2024-01-10',
      category: 'Court Fees',
      status: 'Approved'
    },
    {
      id: 'EXP-002',
      description: 'Document Printing',
      amount: 800,
      date: '2024-01-09',
      category: 'Office Supplies',
      status: 'Pending'
    },
    {
      id: 'EXP-003',
      description: 'Travel to Court',
      amount: 1200,
      date: '2024-01-08',
      category: 'Travel',
      status: 'Approved'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Pending': return 'bg-orange-100 text-orange-800'
      case 'Approved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl shadow-lg border p-8" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
            <p className="text-lg text-gray-600">Here's what's happening with your practice today</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              New Case
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Client
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
              { id: 'cases', name: 'Recent Cases' },
              { id: 'clients', name: 'Clients' },
              { id: 'expenses', name: 'Expenses' },
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
                    {recentCases.slice(0, 3).map((case_) => (
                      <div key={case_.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{case_.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Client: {case_.client}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                          <span className="text-xs text-gray-500">Next: {case_.nextHearing}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Clients */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Clients</h3>
                  <div className="space-y-3">
                    {recentClients.slice(0, 3).map((client) => (
                      <div key={client.id} className="border rounded-lg p-4" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{client.name}</h4>
                          <span className="text-sm text-gray-500">{client.cases} cases</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                        <p className="text-sm text-gray-600 mb-2">{client.phone}</p>
                        <p className="text-xs text-gray-500">Last contact: {client.lastContact}</p>
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
                {recentCases.map((case_) => (
                  <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{case_.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Client: {case_.client}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                      <span className="text-xs text-gray-500">Next hearing: {case_.nextHearing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Clients</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </button>
              </div>
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <span className="text-sm text-gray-500">{client.cases} active cases</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                    <p className="text-sm text-gray-600 mb-2">{client.phone}</p>
                    <p className="text-xs text-gray-500">Last contact: {client.lastContact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Expense Tracking</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
              </div>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      <span className="text-lg font-semibold text-gray-900">₹{expense.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{expense.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                        <span className="text-xs text-gray-500">{expense.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                <p className="text-gray-600 mb-6">Get instant legal research, case analysis, and document insights</p>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Predictive Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">Get predictions on case outcomes and success probability</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Analyze Case
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
                    "Calculate compensation for breach of contract case"
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
import { useState, useEffect } from 'react'
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
  Filter,
  Calendar,
  MessageSquare,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Bell,
  BarChart3,
  PieChart,
  ArrowUpDown,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  SortAsc,
  SortDesc,
  Globe,
  Languages
} from 'lucide-react'

export default function LawyerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  
  // Translation dictionary
  const translations = {
    en: {
      welcome: 'Welcome back',
      practiceToday: "Here's what's happening with your practice today",
      newCase: 'New Case',
      addClient: 'Add Client',
      activeCases: 'Active Cases',
      totalClients: 'Total Clients',
      monthlyRevenue: 'Monthly Revenue',
      pendingFees: 'Pending Fees',
      fromLastMonth: 'from last month',
      upcomingHearings: 'upcoming hearings today',
      overview: 'Overview',
      cases: 'Cases',
      clients: 'Clients',
      expenses: 'Expenses',
      aiResearch: 'AI Research',
      recentCases: 'Recent Cases',
      recentClients: 'Recent Clients',
      viewAll: 'View All',
      allCases: 'All Cases',
      allClients: 'All Clients',
      searchCases: 'Search cases...',
      searchClients: 'Search clients...',
      allStatus: 'All Status',
      allPriority: 'All Priority',
      caseTitle: 'Case Title',
      client: 'Client',
      priority: 'Priority',
      status: 'Status',
      fees: 'Fees',
      nextHearing: 'Next Hearing',
      actions: 'Actions',
      clientName: 'Client Name',
      contact: 'Contact',
      type: 'Type',
      totalFees: 'Total Fees',
      lastContact: 'Last Contact',
      expenseTracking: 'Expense Tracking',
      addExpense: 'Add Expense',
      description: 'Description',
      amount: 'Amount',
      date: 'Date',
      category: 'Category',
      approved: 'Approved',
      pending: 'Pending',
      active: 'Active',
      underReview: 'Under Review',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      civil: 'Civil',
      commercial: 'Commercial',
      family: 'Family',
      criminal: 'Criminal',
      labor: 'Labor',
      individual: 'Individual',
      corporate: 'Corporate',
      courtFees: 'Court Fees',
      officeSupplies: 'Office Supplies',
      travel: 'Travel',
      documents: 'documents',
      complete: 'complete',
      court: 'Court',
      delhiHighCourt: 'Delhi High Court',
      commercialCourt: 'Commercial Court',
      familyCourt: 'Family Court',
      sessionsCourt: 'Sessions Court',
      laborCourt: 'Labor Court'
    },
    hi: {
      welcome: 'वापस स्वागत है',
      practiceToday: 'आज आपके कार्यालय में क्या हो रहा है',
      newCase: 'नया मामला',
      addClient: 'ग्राहक जोड़ें',
      activeCases: 'सक्रिय मामले',
      totalClients: 'कुल ग्राहक',
      monthlyRevenue: 'मासिक आय',
      pendingFees: 'बकाया शुल्क',
      fromLastMonth: 'पिछले महीने से',
      upcomingHearings: 'आज की आगामी सुनवाई',
      overview: 'अवलोकन',
      cases: 'मामले',
      clients: 'ग्राहक',
      expenses: 'व्यय',
      aiResearch: 'AI अनुसंधान',
      recentCases: 'हाल के मामले',
      recentClients: 'हाल के ग्राहक',
      viewAll: 'सभी देखें',
      allCases: 'सभी मामले',
      allClients: 'सभी ग्राहक',
      searchCases: 'मामले खोजें...',
      searchClients: 'ग्राहक खोजें...',
      allStatus: 'सभी स्थिति',
      allPriority: 'सभी प्राथमिकता',
      caseTitle: 'मामले का शीर्षक',
      client: 'ग्राहक',
      priority: 'प्राथमिकता',
      status: 'स्थिति',
      fees: 'शुल्क',
      nextHearing: 'अगली सुनवाई',
      actions: 'कार्य',
      clientName: 'ग्राहक का नाम',
      contact: 'संपर्क',
      type: 'प्रकार',
      totalFees: 'कुल शुल्क',
      lastContact: 'अंतिम संपर्क',
      expenseTracking: 'व्यय ट्रैकिंग',
      addExpense: 'व्यय जोड़ें',
      description: 'विवरण',
      amount: 'राशि',
      date: 'तारीख',
      category: 'श्रेणी',
      approved: 'अनुमोदित',
      pending: 'लंबित',
      active: 'सक्रिय',
      underReview: 'समीक्षा के तहत',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      civil: 'दीवानी',
      commercial: 'व्यावसायिक',
      family: 'पारिवारिक',
      criminal: 'आपराधिक',
      labor: 'श्रम',
      individual: 'व्यक्तिगत',
      corporate: 'कॉर्पोरेट',
      courtFees: 'न्यायालय शुल्क',
      officeSupplies: 'कार्यालय आपूर्ति',
      travel: 'यात्रा',
      documents: 'दस्तावेज',
      complete: 'पूर्ण',
      court: 'न्यायालय',
      delhiHighCourt: 'दिल्ली उच्च न्यायालय',
      commercialCourt: 'व्यावसायिक न्यायालय',
      familyCourt: 'पारिवारिक न्यायालय',
      sessionsCourt: 'सत्र न्यायालय',
      laborCourt: 'श्रम न्यायालय'
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
  
  // Save language preference to localStorage
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('lawyer-dashboard-language', newLanguage)
  }

  // Mock data
  const stats = [
    {
      title: t.activeCases,
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: t.totalClients,
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: t.monthlyRevenue,
      value: '₹2.4L',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: t.pendingFees,
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
      title: language === 'hi' ? 'संपत्ति विवाद - शर्मा बनाम कुमार' : 'Property Dispute - Sharma vs Kumar',
      client: 'Rajesh Sharma',
      status: t.active,
      nextHearing: '2024-01-15',
      priority: t.high,
      caseType: t.civil,
      court: t.delhiHighCourt,
      fees: 150000,
      progress: 65,
      documents: 12,
      lastUpdate: '2024-01-10'
    },
    {
      id: 'CASE-002',
      title: language === 'hi' ? 'अनुबंध उल्लंघन - टेककॉर्प' : 'Contract Breach - TechCorp',
      client: 'TechCorp Pvt Ltd',
      status: t.underReview,
      nextHearing: '2024-01-20',
      priority: t.medium,
      caseType: t.commercial,
      court: t.commercialCourt,
      fees: 200000,
      progress: 40,
      documents: 8,
      lastUpdate: '2024-01-08'
    },
    {
      id: 'CASE-003',
      title: language === 'hi' ? 'तलाक की कार्यवाही - पटेल परिवार' : 'Divorce Proceedings - Patel Family',
      client: 'Priya Patel',
      status: t.active,
      nextHearing: '2024-01-18',
      priority: t.high,
      caseType: t.family,
      court: t.familyCourt,
      fees: 75000,
      progress: 80,
      documents: 15,
      lastUpdate: '2024-01-12'
    },
    {
      id: 'CASE-004',
      title: language === 'hi' ? 'आपराधिक बचाव - चोरी का मामला' : 'Criminal Defense - Theft Case',
      client: 'Amit Singh',
      status: t.pending,
      nextHearing: '2024-01-25',
      priority: t.high,
      caseType: t.criminal,
      court: t.sessionsCourt,
      fees: 100000,
      progress: 30,
      documents: 6,
      lastUpdate: '2024-01-05'
    },
    {
      id: 'CASE-005',
      title: language === 'hi' ? 'रोजगार विवाद - अनुचित समापन' : 'Employment Dispute - Unfair Termination',
      client: 'Sneha Gupta',
      status: t.active,
      nextHearing: '2024-01-22',
      priority: t.medium,
      caseType: t.labor,
      court: t.laborCourt,
      fees: 120000,
      progress: 55,
      documents: 10,
      lastUpdate: '2024-01-09'
    }
  ]

  const recentClients = [
    {
      id: 'CLI-001',
      name: 'Rajesh Sharma',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      cases: 2,
      lastContact: '2024-01-10',
      totalFees: 300000,
      status: t.active,
      address: language === 'hi' ? 'दिल्ली, भारत' : 'Delhi, India',
      type: t.individual
    },
    {
      id: 'CLI-002',
      name: 'TechCorp Pvt Ltd',
      email: 'legal@techcorp.com',
      phone: '+91 98765 43211',
      cases: 1,
      lastContact: '2024-01-08',
      totalFees: 200000,
      status: t.active,
      address: language === 'hi' ? 'मुंबई, भारत' : 'Mumbai, India',
      type: t.corporate
    },
    {
      id: 'CLI-003',
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '+91 98765 43212',
      cases: 1,
      lastContact: '2024-01-12',
      totalFees: 75000,
      status: t.active,
      address: language === 'hi' ? 'बैंगलोर, भारत' : 'Bangalore, India',
      type: t.individual
    },
    {
      id: 'CLI-004',
      name: 'Amit Singh',
      email: 'amit@email.com',
      phone: '+91 98765 43213',
      cases: 1,
      lastContact: '2024-01-05',
      totalFees: 100000,
      status: t.active,
      address: language === 'hi' ? 'पुणे, भारत' : 'Pune, India',
      type: t.individual
    },
    {
      id: 'CLI-005',
      name: 'Sneha Gupta',
      email: 'sneha@email.com',
      phone: '+91 98765 43214',
      cases: 1,
      lastContact: '2024-01-09',
      totalFees: 120000,
      status: t.active,
      address: language === 'hi' ? 'चेन्नई, भारत' : 'Chennai, India',
      type: t.individual
    }
  ]

  const expenses = [
    {
      id: 'EXP-001',
      description: language === 'hi' ? 'न्यायालय फाइलिंग शुल्क' : 'Court Filing Fees',
      amount: 2500,
      date: '2024-01-10',
      category: t.courtFees,
      status: t.approved
    },
    {
      id: 'EXP-002',
      description: language === 'hi' ? 'दस्तावेज मुद्रण' : 'Document Printing',
      amount: 800,
      date: '2024-01-09',
      category: t.officeSupplies,
      status: t.pending
    },
    {
      id: 'EXP-003',
      description: language === 'hi' ? 'न्यायालय की यात्रा' : 'Travel to Court',
      amount: 1200,
      date: '2024-01-08',
      category: t.travel,
      status: t.approved
    }
  ]

  const getStatusColor = (status: string) => {
    // Handle both English and Hindi statuses
    if (status === 'Active' || status === 'सक्रिय') return 'bg-green-100 text-green-800'
    if (status === 'Under Review' || status === 'समीक्षा के तहत') return 'bg-yellow-100 text-yellow-800'
    if (status === 'Pending' || status === 'लंबित') return 'bg-orange-100 text-orange-800'
    if (status === 'Approved' || status === 'अनुमोदित') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    // Handle both English and Hindi priorities
    if (priority === 'High' || priority === 'उच्च') return 'bg-red-100 text-red-800'
    if (priority === 'Medium' || priority === 'मध्यम') return 'bg-yellow-100 text-yellow-800'
    if (priority === 'Low' || priority === 'कम') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Filter and sort functions
  const filteredCases = recentCases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.caseType.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Handle translated statuses and priorities
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'Active' && (case_.status === 'Active' || case_.status === 'सक्रिय')) ||
      (filterStatus === 'Under Review' && (case_.status === 'Under Review' || case_.status === 'समीक्षा के तहत')) ||
      (filterStatus === 'Pending' && (case_.status === 'Pending' || case_.status === 'लंबित'))
    
    const matchesPriority = filterPriority === 'all' || 
      (filterPriority === 'High' && (case_.priority === 'High' || case_.priority === 'उच्च')) ||
      (filterPriority === 'Medium' && (case_.priority === 'Medium' || case_.priority === 'मध्यम')) ||
      (filterPriority === 'Low' && (case_.priority === 'Low' || case_.priority === 'कम'))
    
    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? 
        new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime() :
        new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1, 'उच्च': 3, 'मध्यम': 2, 'कम': 1 }
      return sortOrder === 'asc' ? 
        priorityOrder[a.priority] - priorityOrder[b.priority] :
        priorityOrder[b.priority] - priorityOrder[a.priority]
    } else if (sortBy === 'fees') {
      return sortOrder === 'asc' ? a.fees - b.fees : b.fees - a.fees
    }
    return 0
  })

  const filteredClients = recentClients.filter(client => {
    return client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.type.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
        <div className="rounded-2xl shadow-lg border p-8 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}, {user?.name}</h1>
              <p className="text-lg text-gray-600">{t.practiceToday}</p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Bell className="h-4 w-4 mr-2" />
                  3 {t.upcomingHearings}
                </div>
              </div>
          </div>
          <div className="flex items-center space-x-4">
              {/* Language Toggle Button */}
              <button 
                onClick={toggleLanguage}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                <Languages className="h-5 w-5 mr-2" />
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
                {t.newCase}
            </button>
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
                {t.addClient}
            </button>
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
                  <p className={`text-sm font-medium flex items-center ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change} {t.fromLastMonth}
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
        <div className="border-b" style={{ borderColor: '#ddb892' }}>
          <nav className="-mb-px flex space-x-8 px-8">
            {[
              { id: 'overview', name: t.overview, icon: BarChart3 },
              { id: 'cases', name: t.cases, icon: FileText },
              { id: 'clients', name: t.clients, icon: Users },
              { id: 'expenses', name: t.expenses, icon: Calculator },
              { id: 'ai-research', name: t.aiResearch, icon: Bot }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
              </button>
              )
            })}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Cases */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t.recentCases}</h3>
                    <button 
                      onClick={() => setActiveTab('cases')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      {t.viewAll} <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentCases.slice(0, 3).map((case_) => (
                      <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{case_.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Client: {case_.client}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                          <span className="text-xs text-gray-500">Next: {case_.nextHearing}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">{case_.caseType}</span>
                            <span className="text-xs text-gray-500">₹{case_.fees.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Clients */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t.recentClients}</h3>
                    <button 
                      onClick={() => setActiveTab('clients')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      {t.viewAll} <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentClients.slice(0, 3).map((client) => (
                      <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{client.name}</h4>
                          <span className="text-sm text-gray-500">{client.cases} cases</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                        <p className="text-sm text-gray-600 mb-2">{client.phone}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">{client.type}</span>
                            <span className="text-xs text-gray-500">₹{client.totalFees.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <MessageSquare className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Phone className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.allCases} ({filteredCases.length})</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.searchCases}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                  >
                    <option value="all">{t.allStatus}</option>
                    <option value="Active">{t.active}</option>
                    <option value="Under Review">{t.underReview}</option>
                    <option value="Pending">{t.pending}</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                  >
                    <option value="all">{t.allPriority}</option>
                    <option value="High">{t.high}</option>
                    <option value="Medium">{t.medium}</option>
                    <option value="Low">{t.low}</option>
                  </select>
                </div>
              </div>

              {/* Functional Headers */}
              <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: '#ddb892' }}>
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-3 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('title')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.caseTitle}</span>
                      {sortBy === 'title' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('client')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.client}</span>
                      {sortBy === 'client' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-1 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('priority')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.priority}</span>
                      {sortBy === 'priority' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-1 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.status}</span>
                      {sortBy === 'status' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('fees')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.fees}</span>
                      {sortBy === 'fees' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.nextHearing}</span>
                      {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </button>
                  </div>
                  <div className="col-span-1 text-center">{t.actions}</div>
                </div>
              </div>

              {/* Cases List */}
              <div className="space-y-3">
                {filteredCases.map((case_) => (
                  <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                      <h4 className="font-medium text-gray-900">{case_.title}</h4>
                        <p className="text-xs text-gray-500">{case_.caseType} • {case_.court}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">{case_.client}</p>
                      </div>
                      <div className="col-span-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                    </div>
                      <div className="col-span-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-900">₹{case_.fees.toLocaleString()}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${case_.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{case_.progress}% {t.complete}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">{case_.nextHearing}</p>
                        <p className="text-xs text-gray-500">{case_.documents} {t.documents}</p>
                      </div>
                      <div className="col-span-1 flex items-center justify-center space-x-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="View">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Edit">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="More">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.allClients} ({filteredClients.length})</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.searchClients}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                    />
                  </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                    {t.addClient}
                  </button>
                </div>
              </div>

              {/* Functional Headers */}
              <div className="bg-gray-50 rounded-lg p-4" style={{ backgroundColor: '#ddb892' }}>
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-3 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.clientName}</span>
                      {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <span>{t.contact}</span>
                  </div>
                  <div className="col-span-1 flex items-center space-x-2">
                    <span>{t.type}</span>
                  </div>
                  <div className="col-span-1 flex items-center space-x-2">
                    <span>{t.cases}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <button 
                      onClick={() => handleSort('totalFees')}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <span>{t.totalFees}</span>
                      {sortBy === 'totalFees' && (sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                </button>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <span>{t.lastContact}</span>
                  </div>
                  <div className="col-span-1 text-center">{t.actions}</div>
                </div>
              </div>

              {/* Clients List */}
              <div className="space-y-3">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200" style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {client.address}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${client.type === 'Corporate' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {client.type}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-sm font-medium text-gray-900">{client.cases}</span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-900">₹{client.totalFees.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">{client.lastContact}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-center space-x-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Message">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Call">
                          <Phone className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="More">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t.expenseTracking}</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addExpense}
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
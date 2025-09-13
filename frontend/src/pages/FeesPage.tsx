import { useState, useEffect } from 'react'
import LawyerHeader from '../components/layout/LawyerHeader'
import { 
  DollarSign, 
  Calendar, 
  User, 
  Search, 
  Download,
  Eye,
  Edit,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  
  // Translation dictionary
  const translations = {
    en: {
      feesManagement: 'Fees Management',
      trackAndManage: 'Track and manage all your legal fees and payments',
      addNewFee: 'Add New Fee',
      exportReport: 'Export Report',
      totalFees: 'Total Fees',
      paidFees: 'Paid Fees',
      pendingFees: 'Pending Fees',
      overdueFees: 'Overdue Fees',
      fromLastMonth: 'from last month',
      invoices: 'invoices',
      pending: 'pending',
      overdue: 'overdue',
      allFees: 'All Fees',
      searchFees: 'Search fees...',
      allStatus: 'All Status',
      paid: 'Paid',
      pendingStatus: 'Pending',
      overdueStatus: 'Overdue',
      allTypes: 'All Types',
      consultation: 'Consultation',
      courtFiling: 'Court Filing',
      retainer: 'Retainer',
      legalServices: 'Legal Services',
      documentation: 'Documentation',
      registration: 'Registration',
      caseDetails: 'Case Details',
      client: 'Client',
      feeType: 'Fee Type',
      amount: 'Amount',
      status: 'Status',
      dueDate: 'Due Date',
      actions: 'Actions',
      invoice: 'Invoice',
      view: 'View',
      edit: 'Edit',
      download: 'Download'
    },
    hi: {
      feesManagement: 'शुल्क प्रबंधन',
      trackAndManage: 'अपने सभी कानूनी शुल्क और भुगतान को ट्रैक और प्रबंधित करें',
      addNewFee: 'नया शुल्क जोड़ें',
      exportReport: 'रिपोर्ट निर्यात करें',
      totalFees: 'कुल शुल्क',
      paidFees: 'भुगतान किए गए शुल्क',
      pendingFees: 'लंबित शुल्क',
      overdueFees: 'बकाया शुल्क',
      fromLastMonth: 'पिछले महीने से',
      invoices: 'चालान',
      pending: 'लंबित',
      overdue: 'बकाया',
      allFees: 'सभी शुल्क',
      searchFees: 'शुल्क खोजें...',
      allStatus: 'सभी स्थिति',
      paid: 'भुगतान',
      pendingStatus: 'लंबित',
      overdueStatus: 'बकाया',
      allTypes: 'सभी प्रकार',
      consultation: 'परामर्श',
      courtFiling: 'न्यायालय फाइलिंग',
      retainer: 'रिटेनर',
      legalServices: 'कानूनी सेवाएं',
      documentation: 'दस्तावेजीकरण',
      registration: 'पंजीकरण',
      caseDetails: 'मामले का विवरण',
      client: 'ग्राहक',
      feeType: 'शुल्क प्रकार',
      amount: 'राशि',
      status: 'स्थिति',
      dueDate: 'देय तिथि',
      actions: 'कार्य',
      invoice: 'चालान',
      view: 'देखें',
      edit: 'संपादित करें',
      download: 'डाउनलोड करें'
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

  // Mock data for fees
  const fees = [
    {
      id: 'FEE-001',
      caseTitle: language === 'hi' ? 'संपत्ति विवाद - शर्मा बनाम कुमार' : 'Property Dispute - Sharma vs Kumar',
      clientName: 'Rajesh Sharma',
      caseType: language === 'hi' ? 'दीवानी' : 'Civil',
      feeType: t.consultation,
      amount: 15000,
      status: t.paid,
      date: '2024-01-15',
      dueDate: '2024-01-15',
      description: language === 'hi' ? 'प्रारंभिक परामर्श और मामले का विश्लेषण' : 'Initial consultation and case analysis',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 'FEE-002',
      caseTitle: language === 'hi' ? 'अनुबंध उल्लंघन - टेककॉर्प' : 'Contract Breach - TechCorp',
      clientName: 'TechCorp Pvt Ltd',
      caseType: language === 'hi' ? 'व्यावसायिक' : 'Commercial',
      feeType: t.courtFiling,
      amount: 25000,
      status: t.pendingStatus,
      date: '2024-01-10',
      dueDate: '2024-01-25',
      description: language === 'hi' ? 'न्यायालय फाइलिंग शुल्क और दस्तावेजीकरण' : 'Court filing fees and documentation',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 'FEE-003',
      caseTitle: language === 'hi' ? 'तलाक की कार्यवाही - पटेल परिवार' : 'Divorce Proceedings - Patel Family',
      clientName: 'Priya Patel',
      caseType: language === 'hi' ? 'पारिवारिक' : 'Family',
      feeType: t.retainer,
      amount: 50000,
      status: t.paid,
      date: '2024-01-08',
      dueDate: '2024-01-08',
      description: language === 'hi' ? 'तलाक की कार्यवाही के लिए रिटेनर शुल्क' : 'Retainer fee for divorce proceedings',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 'FEE-004',
      caseTitle: language === 'hi' ? 'आपराधिक बचाव - चोरी का मामला' : 'Criminal Defense - Theft Case',
      clientName: 'Amit Singh',
      caseType: language === 'hi' ? 'आपराधिक' : 'Criminal',
      feeType: t.legalServices,
      amount: 35000,
      status: t.overdueStatus,
      date: '2024-01-05',
      dueDate: '2024-01-20',
      description: language === 'hi' ? 'कानूनी प्रतिनिधित्व और न्यायालय उपस्थिति' : 'Legal representation and court appearances',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 'FEE-005',
      caseTitle: language === 'hi' ? 'रोजगार विवाद - अनुचित समापन' : 'Employment Dispute - Unfair Termination',
      clientName: 'Sneha Gupta',
      caseType: language === 'hi' ? 'श्रम' : 'Labor',
      feeType: t.consultation,
      amount: 12000,
      status: t.paid,
      date: '2024-01-12',
      dueDate: '2024-01-12',
      description: language === 'hi' ? 'रोजगार कानून परामर्श' : 'Employment law consultation',
      invoiceNumber: 'INV-2024-005'
    },
    {
      id: 'FEE-006',
      caseTitle: language === 'hi' ? 'संपत्ति पंजीकरण - नया घर' : 'Property Registration - New House',
      clientName: 'Vikram Mehta',
      caseType: language === 'hi' ? 'संपत्ति' : 'Property',
      feeType: t.documentation,
      amount: 18000,
      status: t.pendingStatus,
      date: '2024-01-18',
      dueDate: '2024-02-01',
      description: language === 'hi' ? 'संपत्ति पंजीकरण और दस्तावेजीकरण सेवाएं' : 'Property registration and documentation services',
      invoiceNumber: 'INV-2024-006'
    },
    {
      id: 'FEE-007',
      caseTitle: language === 'hi' ? 'वसीयत तैयारी - संपत्ति नियोजन' : 'Will Preparation - Estate Planning',
      clientName: 'Mrs. Sunita Agarwal',
      caseType: language === 'hi' ? 'संपत्ति' : 'Estate',
      feeType: t.documentation,
      amount: 22000,
      status: t.paid,
      date: '2024-01-20',
      dueDate: '2024-01-20',
      description: language === 'hi' ? 'वसीयत तैयारी और संपत्ति नियोजन परामर्श' : 'Will preparation and estate planning consultation',
      invoiceNumber: 'INV-2024-007'
    },
    {
      id: 'FEE-008',
      caseTitle: language === 'hi' ? 'ट्रेडमार्क पंजीकरण - ब्रांड नाम' : 'Trademark Registration - Brand Name',
      clientName: 'StartupXYZ Pvt Ltd',
      caseType: language === 'hi' ? 'बौद्धिक संपदा' : 'Intellectual Property',
      feeType: t.registration,
      amount: 45000,
      status: t.pendingStatus,
      date: '2024-01-22',
      dueDate: '2024-02-05',
      description: language === 'hi' ? 'ट्रेडमार्क पंजीकरण और आईपी परामर्श' : 'Trademark registration and IP consultation',
      invoiceNumber: 'INV-2024-008'
    }
  ]

  // Calculate totals
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
  const paidFees = fees.filter(fee => fee.status === t.paid).reduce((sum, fee) => sum + fee.amount, 0)
  const pendingFees = fees.filter(fee => fee.status === t.pendingStatus).reduce((sum, fee) => sum + fee.amount, 0)
  const overdueFees = fees.filter(fee => fee.status === t.overdueStatus).reduce((sum, fee) => sum + fee.amount, 0)

  // Filter fees based on search and filters
  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fee.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fee.feeType.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'Paid' && fee.status === t.paid) ||
      (filterStatus === 'Pending' && fee.status === t.pendingStatus) ||
      (filterStatus === 'Overdue' && fee.status === t.overdueStatus)
    
    const matchesType = filterType === 'all' || fee.feeType === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    if (status === t.paid || status === 'Paid') return 'bg-green-100 text-green-800'
    if (status === t.pendingStatus || status === 'Pending') return 'bg-yellow-100 text-yellow-800'
    if (status === t.overdueStatus || status === 'Overdue') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status === t.paid || status === 'Paid') return <CheckCircle className="h-4 w-4" />
    if (status === t.pendingStatus || status === 'Pending') return <Clock className="h-4 w-4" />
    if (status === t.overdueStatus || status === 'Overdue') return <AlertCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faedcd' }}>
      <LawyerHeader />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-2xl shadow-lg border p-8" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.feesManagement}</h1>
              <p className="text-lg text-gray-600">{t.trackAndManage}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                {t.addNewFee}
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <Download className="h-5 w-5 mr-2" />
                {t.exportReport}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.totalFees}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">₹{totalFees.toLocaleString()}</p>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% {t.fromLastMonth}
                </p>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.paidFees}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">₹{paidFees.toLocaleString()}</p>
                <p className="text-sm font-medium text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {fees.filter(fee => fee.status === t.paid).length} {t.invoices}
                </p>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.pendingFees}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">₹{pendingFees.toLocaleString()}</p>
                <p className="text-sm font-medium text-yellow-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {fees.filter(fee => fee.status === t.pendingStatus).length} {t.pending}
                </p>
              </div>
              <div className="bg-yellow-500 p-4 rounded-2xl shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.overdueFees}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">₹{overdueFees.toLocaleString()}</p>
                <p className="text-sm font-medium text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {fees.filter(fee => fee.status === t.overdueStatus).length} {t.overdue}
                </p>
              </div>
              <div className="bg-red-500 p-4 rounded-2xl shadow-lg">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Fees Table */}
        <div className="rounded-2xl shadow-lg border" style={{ backgroundColor: '#faedcd', borderColor: '#ddb892' }}>
          <div className="p-6 border-b" style={{ borderColor: '#ddb892' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t.allFees} ({filteredFees.length})</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchFees}
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
                  <option value="Paid">{t.paid}</option>
                  <option value="Pending">{t.pendingStatus}</option>
                  <option value="Overdue">{t.overdueStatus}</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#ddb892', backgroundColor: '#faedcd' }}
                >
                  <option value="all">{t.allTypes}</option>
                  <option value={t.consultation}>{t.consultation}</option>
                  <option value={t.courtFiling}>{t.courtFiling}</option>
                  <option value={t.retainer}>{t.retainer}</option>
                  <option value={t.legalServices}>{t.legalServices}</option>
                  <option value={t.documentation}>{t.documentation}</option>
                  <option value={t.registration}>{t.registration}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#ddb892' }}>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.caseDetails}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.client}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.feeType}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.amount}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.status}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.dueDate}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => (
                  <tr key={fee.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#ddb892' }}>
                    <td className="py-4 px-6">
                      <div>
                        <h4 className="font-medium text-gray-900">{fee.caseTitle}</h4>
                        <p className="text-sm text-gray-600">{fee.caseType}</p>
                        <p className="text-xs text-gray-500">Invoice: {fee.invoiceNumber}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{fee.clientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{fee.feeType}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-semibold text-gray-900">₹{fee.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                        {getStatusIcon(fee.status)}
                        <span className="ml-1">{fee.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{fee.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title={t.view}>
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title={t.edit}>
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title={t.download}>
                          <Download className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

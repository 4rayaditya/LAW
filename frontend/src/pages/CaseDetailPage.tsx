import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { formatDate, getUrgencyColor, getStatusColor } from '../lib/utils'
import { 
  ArrowLeft,
  FileText,
  Upload,
  Bot,
  TrendingUp,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Share2
} from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

interface Case {
  id: string
  caseNumber: string
  title: string
  type: string
  subtype: string
  status: string
  urgency: string
  hearingDate: string
  description: string
  judge: {
    id: string
    name: string
    email: string
    courtId: string
  }
  lawyer: {
    id: string
    name: string
    email: string
    barId: string
  }
  client: {
    id: string
    name: string
    email: string
  }
  ipcSections: Array<{
    ipcSection: {
      sectionCode: string
      description: string
    }
  }>
  documents: Array<{
    id: string
    fileName: string
    fileUrl: string
    documentType: string
    extractedText: string
    isApprovedByLawyer: boolean
    isSharedWithJudge: boolean
    uploadedAt: string
    uploadedBy: {
      id: string
      name: string
      role: string
    }
  }>
  documentRequests: Array<{
    id: string
    documentType: string
    description: string
    isCompleted: boolean
    requestedAt: string
    requestedBy: {
      id: string
      name: string
    }
  }>
}

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: caseData, isLoading, error } = useQuery<Case>(
    ['case', caseId],
    async () => {
      const response = await api.get(`/cases/${caseId}`)
      return response.data.case
    },
    {
      enabled: !!caseId,
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Case not found or access denied</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'evidence', name: 'Evidence Room', icon: Upload },
    { id: 'judge-view', name: 'Judge\'s View', icon: Eye },
    ...(user?.role === 'LAWYER' ? [
      { id: 'ai', name: 'AI Assistant', icon: Bot },
      { id: 'predict', name: 'Predictive Analysis', icon: TrendingUp }
    ] : [])
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab caseData={caseData} />
      case 'evidence':
        return <EvidenceRoomTab caseData={caseData} />
      case 'judge-view':
        return <JudgeViewTab caseData={caseData} />
      case 'ai':
        return <AIAssistantTab caseData={caseData} />
      case 'predict':
        return <PredictiveAnalysisTab caseData={caseData} />
      default:
        return <OverviewTab caseData={caseData} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.caseNumber}</h1>
            <p className="text-gray-600">{caseData.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(caseData.urgency)}`}>
            {t('urgency.' + caseData.urgency)}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
            {t('status.' + caseData.status)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  )
}

// Tab Components
function OverviewTab({ caseData }: { caseData: Case }) {
  const { t } = useTranslation()

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Case Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Case Number</label>
              <p className="text-sm text-gray-900">{caseData.caseNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <p className="text-sm text-gray-900">{caseData.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900">{caseData.type} - {caseData.subtype}</p>
            </div>
            {caseData.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{caseData.description}</p>
              </div>
            )}
            {caseData.hearingDate && (
              <div>
                <label className="text-sm font-medium text-gray-700">Next Hearing</label>
                <p className="text-sm text-gray-900">{formatDate(caseData.hearingDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Parties Involved */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties Involved</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Judge</label>
              <p className="text-sm text-gray-900">{caseData.judge.name}</p>
              <p className="text-xs text-gray-500">Court ID: {caseData.judge.courtId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Lawyer</label>
              <p className="text-sm text-gray-900">{caseData.lawyer.name}</p>
              <p className="text-xs text-gray-500">Bar ID: {caseData.lawyer.barId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Client</label>
              <p className="text-sm text-gray-900">{caseData.client.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* IPC Sections */}
      {caseData.ipcSections.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applied IPC Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseData.ipcSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Section {section.ipcSection.sectionCode}</h4>
                <p className="text-sm text-gray-600 mt-1">{section.ipcSection.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EvidenceRoomTab({ caseData }: { caseData: Case }) {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Requests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Requests</h3>
          <div className="space-y-3">
            {caseData.documentRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.documentType}</h4>
                    {request.description && (
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Requested by {request.requestedBy.name} on {formatDate(request.requestedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {caseData.documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                    <p className="text-sm text-gray-600">{doc.documentType}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded by {doc.uploadedBy.name} on {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.isApprovedByLawyer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function JudgeViewTab({ caseData }: { caseData: Case }) {
  const { t } = useTranslation()

  const sharedDocuments = caseData.documents.filter(doc => doc.isSharedWithJudge)

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Shared by Lawyer</h3>
      {sharedDocuments.length > 0 ? (
        <div className="space-y-4">
          {sharedDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                  <p className="text-sm text-gray-600">{doc.documentType}</p>
                  <p className="text-xs text-gray-500">
                    Shared on {formatDate(doc.uploadedAt)}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents shared by lawyer yet</p>
        </div>
      )}
    </div>
  )
}

function AIAssistantTab({ caseData }: { caseData: Case }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuery = async () => {
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const response = await api.post(`/ai/query/${caseData.id}`, { query })
      setResponse(response.data.response)
    } catch (error) {
      console.error('AI query failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ask a question about this case
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Summarize the FIR, Find all mentions of alibi..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleQuery}
              disabled={loading || !query.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Ask'}
            </button>
          </div>
        </div>

        {response && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PredictiveAnalysisTab({ caseData }: { caseData: Case }) {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/ai/predict/${caseData.id}`)
      setAnalysis(response.data.analysis)
    } catch (error) {
      console.error('Predictive analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Predictive Analysis</h3>
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Generate Analysis'}
        </button>
      </div>

      {analysis ? (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Prediction</h4>
            <p className="text-sm text-blue-800">{analysis.prediction}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Confidence</h4>
            <p className="text-sm text-green-800">{analysis.confidence}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Recommendations</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              {analysis.recommendations.map((rec: string, index: number) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Click "Generate Analysis" to get AI-powered insights</p>
        </div>
      )}
    </div>
  )
}

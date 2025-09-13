import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  Share2, 
  Eye,
  FileText,
  Plus,
  Clock,
  AlertCircle
} from 'lucide-react'
import DocumentUpload from './DocumentUpload'
import LoadingSpinner from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface DocumentManagerProps {
  caseId: string
  userRole: string
}

interface Document {
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
}

interface DocumentRequest {
  id: string
  documentType: string
  description: string
  isCompleted: boolean
  requestedAt: string
  requestedBy: {
    id: string
    name: string
  }
}

export default function DocumentManager({ caseId, userRole }: DocumentManagerProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [showUpload, setShowUpload] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  // Fetch documents
  const { data: documents, isLoading: documentsLoading } = useQuery<Document[]>(
    ['documents', caseId],
    async () => {
      const response = await api.get(`/documents/case/${caseId}`)
      return response.data.documents
    },
    {
      enabled: !!caseId,
    }
  )

  // Fetch document requests
  const { data: requests, isLoading: requestsLoading } = useQuery<DocumentRequest[]>(
    ['document-requests', caseId],
    async () => {
      const response = await api.get(`/documents/requests/${caseId}`)
      return response.data.requests
    },
    {
      enabled: !!caseId,
    }
  )

  // Approve/Reject document mutation
  const approveMutation = useMutation(
    async ({ docId, approved }: { docId: string; approved: boolean }) => {
      const response = await api.put(`/documents/${docId}/approve`, { approved })
      return response.data
    },
    {
      onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries(['documents', caseId])
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Operation failed')
      },
    }
  )

  // Share documents with judge mutation
  const shareMutation = useMutation(
    async (documentIds: string[]) => {
      const response = await api.post('/documents/share-with-judge', { documentIds })
      return response.data
    },
    {
      onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries(['documents', caseId])
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Share failed')
      },
    }
  )

  // Download document
  const downloadDocument = async (docId: string, fileName: string) => {
    try {
      const response = await api.get(`/documents/${docId}/download`)
      const { downloadUrl } = response.data
      
      // Create a temporary link to download the file
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast.error('Download failed')
    }
  }

  const handleApprove = (docId: string, approved: boolean) => {
    approveMutation.mutate({ docId, approved })
  }

  const handleShareWithJudge = () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to share')
      return
    }
    shareMutation.mutate(selectedDocuments)
  }

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const openUpload = (documentType: string) => {
    setSelectedDocumentType(documentType)
    setShowUpload(true)
  }

  if (documentsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const pendingRequests = requests?.filter(r => !r.isCompleted) || []
  const approvedDocuments = documents?.filter(d => d.isApprovedByLawyer) || []
  const sharedDocuments = documents?.filter(d => d.isSharedWithJudge) || []

  return (
    <div className="space-y-6">
      {/* Document Requests (for Clients) */}
      {userRole === 'CLIENT' && pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Document Requests</h3>
            <p className="text-sm text-gray-600">Your lawyer has requested these documents</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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
                  <button
                    onClick={() => openUpload(request.documentType)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Upload (for Clients) */}
      {userRole === 'CLIENT' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
            <p className="text-sm text-gray-600">Upload case-related documents</p>
          </div>
          <div className="p-6">
            <button
              onClick={() => openUpload('Other')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      )}

      {/* Document Management (for Lawyers) */}
      {userRole === 'LAWYER' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document Management</h3>
                <p className="text-sm text-gray-600">Review and manage uploaded documents</p>
              </div>
              {approvedDocuments.length > 0 && (
                <button
                  onClick={handleShareWithJudge}
                  disabled={selectedDocuments.length === 0 || shareMutation.isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share with Judge ({selectedDocuments.length})</span>
                </button>
              )}
            </div>
          </div>
          <div className="p-6">
            {documents && documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {userRole === 'LAWYER' && doc.isApprovedByLawyer && (
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        )}
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                          <p className="text-sm text-gray-600">{doc.documentType}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {doc.uploadedBy.name} on {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Status Indicators */}
                        <div className="flex items-center space-x-1">
                          {doc.isApprovedByLawyer ? (
                            <CheckCircle className="h-5 w-5 text-green-600" title="Approved" />
                          ) : (
                            <XCircle className="h-5 w-5 text-yellow-600" title="Pending Approval" />
                          )}
                          {doc.isSharedWithJudge && (
                            <Share2 className="h-5 w-5 text-blue-600" title="Shared with Judge" />
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => downloadDocument(doc.id, doc.fileName)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          {userRole === 'LAWYER' && !doc.isApprovedByLawyer && (
                            <>
                              <button
                                onClick={() => handleApprove(doc.id, true)}
                                disabled={approveMutation.isLoading}
                                className="p-2 text-green-600 hover:text-green-700"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleApprove(doc.id, false)}
                                disabled={approveMutation.isLoading}
                                className="p-2 text-red-600 hover:text-red-700"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Extracted Text Preview */}
                    {doc.extractedText && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Extracted Text:</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {doc.extractedText.substring(0, 200)}
                          {doc.extractedText.length > 200 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Judge's View */}
      {userRole === 'JUDGE' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Shared Documents</h3>
            <p className="text-sm text-gray-600">Documents shared by the lawyer</p>
          </div>
          <div className="p-6">
            {sharedDocuments.length > 0 ? (
              <div className="space-y-4">
                {sharedDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                          <p className="text-sm text-gray-600">{doc.documentType}</p>
                          <p className="text-xs text-gray-500">
                            Shared on {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadDocument(doc.id, doc.fileName)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Download"
                      >
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
        </div>
      )}

      {/* Document Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <DocumentUpload
              caseId={caseId}
              documentType={selectedDocumentType}
              onUploadComplete={() => setShowUpload(false)}
              onClose={() => setShowUpload(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { api } from '../../lib/api'
import { Upload, FileText, Camera, X, CheckCircle, AlertCircle } from 'lucide-react'
import DocumentScanner from './DocumentScanner'
import LoadingSpinner from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  caseId: string
  documentType: string
  onUploadComplete?: () => void
  onClose?: () => void
}

export default function DocumentUpload({ caseId, documentType, onUploadComplete, onClose }: DocumentUploadProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [showScanner, setShowScanner] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadMutation = useMutation(
    async ({ file, extractedText }: { file: File; extractedText?: string }) => {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('documentType', documentType)
      if (extractedText) {
        formData.append('extractedText', extractedText)
      }

      const response = await api.post(`/documents/upload/${caseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          }
        },
      })

      return response.data
    },
    {
      onSuccess: () => {
        toast.success(t('documents.uploadSuccess'))
        queryClient.invalidateQueries(['case', caseId])
        queryClient.invalidateQueries(['documents', caseId])
        onUploadComplete?.()
        onClose?.()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Upload failed')
      },
    }
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please select a PDF, image, or document file.')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Please select a file smaller than 10MB.')
      return
    }

    uploadMutation.mutate({ file })
  }

  const handleScanComplete = (imageFile: File, extractedText: string) => {
    uploadMutation.mutate({ file: imageFile, extractedText })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload {documentType}</h3>
          <p className="text-gray-600">Choose how you'd like to upload your document</p>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Upload File</span>
            <span className="text-xs text-gray-500 mt-1">PDF, Images, Documents</span>
          </button>

          <button
            onClick={() => setShowScanner(true)}
            disabled={uploading}
            className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            <Camera className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Scan Document</span>
            <span className="text-xs text-gray-500 mt-1">Use Camera</span>
          </button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Supported Formats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Supported Formats</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>PDF Documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Word Documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Images (JPG, PNG)</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Text Files</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
        </div>

        {/* Action Buttons */}
        {onClose && (
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Document Scanner Modal */}
      {showScanner && (
        <DocumentScanner
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  )
}

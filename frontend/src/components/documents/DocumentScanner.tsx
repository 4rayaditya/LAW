import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Tesseract from 'tesseract.js'
import { Camera, Upload, X, Check, RotateCcw } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'

interface DocumentScannerProps {
  onScanComplete: (imageFile: File, extractedText: string) => void
  onClose: () => void
}

export default function DocumentScanner({ onScanComplete, onClose }: DocumentScannerProps) {
  const { t } = useTranslation()
  const [isScanning, setIsScanning] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
      console.error('Camera access error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        stopCamera()
        processImage(blob)
      }
    }, 'image/jpeg', 0.8)
  }

  const processImage = async (imageBlob: Blob) => {
    setIsProcessing(true)
    setError('')
    
    try {
      // Convert blob to file
      const imageFile = new File([imageBlob], 'scanned-document.jpg', { type: 'image/jpeg' })
      
      // Process with Tesseract.js
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng+hin', // English and Hindi
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`Progress: ${Math.round(m.progress * 100)}%`)
            }
          }
        }
      )
      
      setExtractedText(text.trim())
    } catch (err) {
      setError('Failed to process image. Please try again.')
      console.error('OCR processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Process the image
    processImage(file)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setExtractedText('')
    setError('')
    startCamera()
  }

  const confirmScan = () => {
    if (!capturedImage || !extractedText) return

    // Convert image URL back to file
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'scanned-document.jpg', { type: 'image/jpeg' })
        onScanComplete(file, extractedText)
        onClose()
      })
      .catch(err => {
        setError('Failed to process image')
        console.error('Error converting image:', err)
      })
  }

  const cleanup = () => {
    stopCamera()
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scan Document</h2>
          <button
            onClick={() => {
              cleanup()
              onClose()
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {!capturedImage ? (
            /* Camera Interface */
            <div className="space-y-4">
              {!isScanning ? (
                /* Start Camera or Upload */
                <div className="space-y-4">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Scan Document</h3>
                    <p className="text-gray-600">Use your camera to scan a document or upload an image</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCamera}
                      className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Use Camera</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Upload Image</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Camera View */
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-white border-dashed m-4 rounded-lg pointer-events-none">
                      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-white"></div>
                      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-white"></div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-white"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-white"></div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={captureImage}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Capture</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Image Preview and Text Extraction */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Document Scanned</h3>
                <p className="text-gray-600">Review the extracted text below</p>
              </div>

              {/* Image Preview */}
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Scanned document"
                  className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                />
                <button
                  onClick={retakePhoto}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="text-blue-700">Processing document...</span>
                </div>
              )}

              {/* Extracted Text */}
              {extractedText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extracted Text
                  </label>
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can edit the extracted text if needed
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={confirmScan}
                  disabled={!extractedText || isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Check className="h-5 w-5" />
                  <span>Confirm & Upload</span>
                </button>
                <button
                  onClick={retakePhoto}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

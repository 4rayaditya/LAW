import React, { useState } from 'react'
import { api } from '../lib/api'

export default function TestConnection() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testBackendConnection = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('Testing backend connection...')
      const response = await api.get('/health')
      setResult(`✅ Backend connected successfully! Status: ${response.data.status}`)
      console.log('Backend response:', response.data)
    } catch (error: any) {
      console.error('Backend connection failed:', error)
      setResult(`❌ Backend connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('Testing login...')
      const response = await api.post('/auth/login', {
        email: 'judge@nyaysphere.com',
        password: 'password123'
      })
      setResult(`✅ Login successful! User: ${response.data.user.name} (${response.data.user.role})`)
      console.log('Login response:', response.data)
    } catch (error: any) {
      console.error('Login test failed:', error)
      setResult(`❌ Login failed: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Test Backend Connection
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Test Login
          </button>
        </div>
        
        {result && (
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
        
        {loading && (
          <div className="text-sm text-gray-600">Testing...</div>
        )}
      </div>
    </div>
  )
}

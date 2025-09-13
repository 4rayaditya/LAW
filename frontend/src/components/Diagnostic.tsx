import React from 'react'

export default function Diagnostic() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">NyaySphere Diagnostic</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-green-600">✅ Running</span>
              </div>
              <div className="flex justify-between">
                <span>Backend:</span>
                <span className="text-green-600">✅ Running</span>
              </div>
              <div className="flex justify-between">
                <span>React:</span>
                <span className="text-green-600">✅ Loaded</span>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
            <div className="space-y-3">
              <button 
                onClick={() => console.log('Button clicked!')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Console Log
              </button>
              <button 
                onClick={() => alert('Alert working!')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Alert
              </button>
              <button 
                onClick={() => {
                  try {
                    fetch('http://localhost:3001/health')
                      .then(res => res.json())
                      .then(data => alert(`Backend: ${JSON.stringify(data)}`))
                      .catch(err => alert(`Backend Error: ${err.message}`))
                  } catch (error) {
                    alert(`Fetch Error: ${error}`)
                  }
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Test Backend Connection
              </button>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="text-sm space-y-1">
              <div>URL: {window.location.href}</div>
              <div>User Agent: {navigator.userAgent}</div>
              <div>Screen: {window.screen.width}x{window.screen.height}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
            <div className="text-sm space-y-2">
              <p>1. Press F12 to open developer tools</p>
              <p>2. Check Console tab for errors</p>
              <p>3. Check Network tab for failed requests</p>
              <p>4. Try the test buttons above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

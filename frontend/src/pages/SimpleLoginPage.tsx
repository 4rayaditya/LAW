import { useAuth } from '../hooks/useAuth'
import { Scale, Users, Gavel, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SimpleLoginPage() {
  const { login } = useAuth()

  const handleRoleLogin = async (role: 'JUDGE' | 'LAWYER' | 'CLIENT') => {
    try {
      // Use predefined credentials for each role
      const credentials = {
        JUDGE: { email: 'judge@nyaysphere.com', password: 'password123' },
        LAWYER: { email: 'lawyer@nyaysphere.com', password: 'password123' },
        CLIENT: { email: 'client@nyaysphere.com', password: 'password123' }
      }

      const { email, password } = credentials[role]
      await login(email, password)
      
      toast.success(`Welcome, ${role}!`)
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    }
  }

  const roles = [
    {
      id: 'JUDGE',
      title: 'Judge',
      description: 'Access case management, hearings, and judicial decisions',
      icon: Scale,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'LAWYER',
      title: 'Lawyer',
      description: 'Manage cases, clients, and legal documentation',
      icon: Gavel,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'CLIENT',
      title: 'Client',
      description: 'View case status, upload documents, and communicate',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <Scale className="h-12 w-12 text-white" />
            </div>
          </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    NY.AI
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    Legal Intelligence Platform
                  </p>
          <p className="text-lg text-gray-500">
            Select your role to continue
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <button
                key={role.id}
                onClick={() => handleRoleLogin(role.id as 'JUDGE' | 'LAWYER' | 'CLIENT')}
                className="group bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-6">
                  <div className={`${role.color} p-4 rounded-xl mr-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {role.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                    Click to enter
                  </span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                    <span className="text-gray-600 text-lg">→</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Case Management</h3>
              <p className="text-gray-600 text-sm">Comprehensive case tracking and management</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Gavel className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600 text-sm">AI-powered document analysis and insights</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Sharing</h3>
              <p className="text-gray-600 text-sm">Secure document upload and sharing</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-orange-100 p-3 rounded-xl w-fit mx-auto mb-4">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multilingual</h3>
              <p className="text-gray-600 text-sm">Support for English and Hindi</p>
            </div>
          </div>
        </div>

        {/* Footer */}
                <div className="mt-12 text-center">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <p className="text-gray-600">© 2024 NY.AI. All rights reserved.</p>
                    <p className="text-gray-500 mt-1 text-sm">Secure • Reliable • Efficient</p>
                  </div>
                </div>
      </div>
    </div>
  )
}

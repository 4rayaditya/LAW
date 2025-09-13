import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar,
  Gavel,
  BarChart3,
  LogOut,
  Bell,
  Globe,
  Scale
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function JudgeHeader() {
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Cases',
      href: '/cases',
      icon: FileText
    },
    {
      name: 'Hearings',
      href: '/hearings',
      icon: Calendar
    },
    {
      name: 'Judgments',
      href: '/judgments',
      icon: Gavel
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3
    },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="shadow-lg border-b h-20" style={{ backgroundColor: '#ddb892', borderColor: '#ddb892' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5" style={{ color: '#ddb892' }} />
              </div>
              <span className="text-xl font-bold text-gray-900">NY.AI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 rounded-xl px-4 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border-none outline-none bg-transparent text-gray-700 font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {/* Notifications */}
            <button className="relative p-3 rounded-xl text-gray-400 hover:text-gray-600 transition-all duration-200" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Scale className="h-5 w-5" style={{ color: '#ddb892' }} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-all duration-200"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


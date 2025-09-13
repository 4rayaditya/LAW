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
    <header className="shadow-lg border-b" style={{ backgroundColor: '#ddb892', borderColor: '#ddb892' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5" style={{ color: '#ddb892' }} />
              </div>
              <span className="text-xl font-bold text-white">NY.AI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-white bg-opacity-20'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border border-white border-opacity-30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
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
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white text-opacity-80 font-medium">Judge</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-white hover:text-white transition-all duration-200"
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


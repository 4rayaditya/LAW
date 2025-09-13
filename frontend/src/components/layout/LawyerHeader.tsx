import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  DollarSign,
  Calculator,
  Bot,
  LogOut,
  Bell,
  Globe
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function LawyerHeader() {
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard
    },
    // {
    //   name: 'Cases',
    //   href: '/cases',
    //   icon: FileText
    // },
    // {
    //   name: 'Clients',
    //   href: '/clients',
    //   icon: Users
    // },
    // {
    //   name: 'Expenses',
    //   href: '/expenses',
    //   icon: DollarSign
    // },
    {
      name: 'Fees',
      href: '/fees',
      icon: Calculator
    },
    // {
    //   name: 'AI Research',
    //   href: '/ai-research',
    //   icon: Bot
    // }
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="shadow-lg border-b sticky top-0 z-50" style={{ backgroundColor: '#ddb892' }}>
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand - Leftmost */}
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NY.AI</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-6">
            {/* Language Switcher */}
            {/* <div className="flex items-center space-x-2 rounded-xl px-4 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border-none outline-none bg-transparent text-gray-700 font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div> */}

            {/* Notifications */}
            <button className="relative p-3 rounded-xl text-gray-400 hover:text-gray-600 transition-all duration-200" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-4 rounded-xl px-4 py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 font-medium">Lawyer</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-all duration-200"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          <nav className="flex space-x-4 py-3 overflow-x-auto px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

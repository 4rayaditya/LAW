import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'
import { 
  Scale, 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Bot, 
  User, 
  Settings,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/',
      icon: LayoutDashboard,
      roles: ['JUDGE', 'LAWYER', 'CLIENT']
    },
    {
      name: t('navigation.cases'),
      href: '/cases',
      icon: FileText,
      roles: ['JUDGE', 'LAWYER', 'CLIENT']
    },
    {
      name: t('navigation.documents'),
      href: '/documents',
      icon: Upload,
      roles: ['JUDGE', 'LAWYER', 'CLIENT']
    },
    {
      name: t('navigation.ai'),
      href: '/ai',
      icon: Bot,
      roles: ['LAWYER']
    },
    {
      name: t('navigation.profile'),
      href: '/profile',
      icon: User,
      roles: ['JUDGE', 'LAWYER', 'CLIENT']
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      roles: ['JUDGE', 'LAWYER', 'CLIENT']
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  )

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{t('app.name')}</h1>
              <p className="text-xs text-gray-500">{t('roles.' + user?.role)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

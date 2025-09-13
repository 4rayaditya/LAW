import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { Menu, Bell, Globe, LogOut } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

interface HeaderProps {
  onMenuClick: () => void
  language: string
  onLanguageChange: (lang: string) => void
}

export default function Header({ onMenuClick, language, onLanguageChange }: HeaderProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('dashboard.welcome', { name: user?.name })}
            </h1>
            <p className="text-sm text-gray-500">
              {t('roles.' + user?.role)} • {user?.barId || user?.courtId || 'NyaySphere'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-sm border-none outline-none bg-transparent text-gray-700"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:block text-sm">{t('auth.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

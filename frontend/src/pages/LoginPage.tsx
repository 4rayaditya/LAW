import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import TestConnection from '../components/TestConnection'
import { Scale, Users, Gavel, Globe } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export default function LoginPage() {
  const { t } = useTranslation()
  const { login, register } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const handleLogin = async (data: LoginForm) => {
    setLoading(true)
    try {
      console.log('LoginPage: Starting login process with:', { email: data.email, password: '***' })
      await login(data.email, data.password)
      console.log('LoginPage: Login successful')
      toast.success(t('auth.loginSuccess'))
    } catch (error: any) {
      console.error('LoginPage: Login failed:', error)
      console.error('LoginPage: Error message:', error.message)
      console.error('LoginPage: Error stack:', error.stack)
      toast.error(error.message || t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true)
    try {
      await register(data.email, data.password, data.name)
      toast.success(t('auth.registerSuccess'))
    } catch (error: any) {
      toast.error(error.message || t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2">
          <Globe className="h-4 w-4 text-gray-600" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border-none outline-none bg-transparent"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 p-3 rounded-xl">
                <Scale className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t('app.name')}</h1>
                <p className="text-blue-100">{t('app.tagline')}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Choose Your Role</h3>
                  <p className="text-blue-100 text-sm">Judge, Lawyer, or Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
              </p>
            </div>

            {/* Toggle between Login and Register */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('auth.register')}
              </button>
            </div>

            {/* Login Form */}
            {isLogin && (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    {...loginForm.register('email')}
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.password')}
                  </label>
                  <input
                    {...loginForm.register('password')}
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    t('auth.loginButton')
                  )}
                </button>
              </form>
            )}

            {/* Register Form */}
            {!isLogin && (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    {...registerForm.register('name')}
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    {...registerForm.register('email')}
                    type="email"
                    id="reg-email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.password')}
                  </label>
                  <input
                    {...registerForm.register('password')}
                    type="password"
                    id="reg-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Create a password"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    t('auth.registerButton')
                  )}
                </button>
              </form>
            )}

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Judge:</strong> judge@nyaysphere.com / password123</p>
                <p><strong>Lawyer:</strong> lawyer@nyaysphere.com / password123</p>
                <p><strong>Client:</strong> client@nyaysphere.com / password123</p>
              </div>
            </div>

            {/* Test Connection */}
            <div className="mt-4">
              <TestConnection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

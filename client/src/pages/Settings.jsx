import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Shield, 
  Lock, 
  Key, 
  Bell, 
  Monitor,
  User,
  X,
  LogOut,
  Save
} from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import ProtectedRoute from '../components/ProtectedRoute'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmNewPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
})

const Settings = () => {
  const { user, changePassword, logout, setup2FA, verify2FA, disable2FA } = useAuth()
  const [loading, setLoading] = useState(false)
  const [twoFactorModal, setTwoFactorModal] = useState(false)
  const [twoFactorSetup, setTwoFactorSetup] = useState(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('security')
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    security: true,
    marketing: false,
  })
  const [compactMode, setCompactMode] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onPasswordChange = async (data) => {
    setLoading(true)
    const result = await changePassword(data)
    setLoading(false)
    if (result.success) {
      reset()
    }
  }

  const settingsSections = [
    {
      title: 'Security Settings',
      icon: Shield,
      items: [
        {
          label: 'Two-Factor Authentication',
          status: user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled',
          color: user?.isTwoFactorEnabled ? 'text-green-500' : 'text-yellow-500',
        },
        { label: 'Email Verification', status: 'Verified', color: 'text-green-500' },
        { label: 'Session Management', status: 'Active', color: 'text-green-500' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', status: 'Enabled', color: 'text-green-500' },
        { label: 'Security Alerts', status: 'Enabled', color: 'text-green-500' },
        { label: 'Marketing Emails', status: 'Disabled', color: 'text-yellow-500' },
      ]
    },
  ]

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'account', label: 'Account', icon: User },
  ]

  const toggleNotification = (key) => {
    setNotificationPrefs((prefs) => ({
      ...prefs,
      [key]: !prefs[key],
    }))
  }

  const open2FA = async () => {
    setTwoFactorCode('')
    setTwoFactorSetup(null)
    setTwoFactorModal(true)

    if (!user?.isTwoFactorEnabled) {
      setTwoFactorLoading(true)
      const result = await setup2FA()
      setTwoFactorLoading(false)
      if (result.success) {
        setTwoFactorSetup(result.data)
      }
    }
  }

  const submit2FA = async (event) => {
    event.preventDefault()
    setTwoFactorLoading(true)
    const result = user?.isTwoFactorEnabled
      ? await disable2FA(twoFactorCode)
      : await verify2FA(twoFactorCode)
    setTwoFactorLoading(false)

    if (result.success) {
      setTwoFactorModal(false)
      setTwoFactorSetup(null)
      setTwoFactorCode('')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">Settings</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="space-y-4">
                <GlassCard className="p-4">
                  <div className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-500/10 text-primary-400'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <tab.icon size={17} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </GlassCard>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'security' && (
                  <>
                    <GlassCard className="p-6">
                      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary-400" />
                        Change Password
                      </h2>
                      <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
                        <AuthInput
                          type="password"
                          label="Current Password"
                          placeholder="Enter current password"
                          icon={Lock}
                          error={errors.currentPassword?.message}
                          {...register('currentPassword')}
                        />
                        <AuthInput
                          type="password"
                          label="New Password"
                          placeholder="Enter new password"
                          icon={Lock}
                          error={errors.newPassword?.message}
                          {...register('newPassword')}
                        />
                        <AuthInput
                          type="password"
                          label="Confirm New Password"
                          placeholder="Confirm new password"
                          icon={Lock}
                          error={errors.confirmNewPassword?.message}
                          {...register('confirmNewPassword')}
                        />
                        <AuthButton type="submit" loading={loading}>
                          <Save size={18} className="mr-2 inline" />
                          Update Password
                        </AuthButton>
                      </form>
                    </GlassCard>

                    {settingsSections.map((section, index) => (
                      <GlassCard key={index} className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <section.icon className="w-5 h-5 text-primary-400" />
                          {section.title}
                        </h2>
                        <div className="space-y-3">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                              <span className="text-sm">{item.label}</span>
                              <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium ${item.color}`}>
                                  {item.status}
                                </span>
                                {item.label === 'Two-Factor Authentication' && (
                                  <button
                                    type="button"
                                    onClick={open2FA}
                                    className="px-3 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-xs font-medium transition-colors"
                                  >
                                    {user?.isTwoFactorEnabled ? 'Manage' : 'Enable'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    ))}
                  </>
                )}

                {activeTab === 'notifications' && (
                  <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary-400" />
                      Notifications
                    </h2>
                    <div className="space-y-3">
                      {[
                        ['email', 'Email Notifications'],
                        ['security', 'Security Alerts'],
                        ['marketing', 'Marketing Emails'],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleNotification(key)}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-sm">{label}</span>
                          <span className={`text-sm font-medium ${notificationPrefs[key] ? 'text-green-500' : 'text-yellow-500'}`}>
                            {notificationPrefs[key] ? 'Enabled' : 'Disabled'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {activeTab === 'appearance' && (
                  <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary-400" />
                      Appearance
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm">Theme</span>
                        <span className="text-sm font-medium text-primary-400">Dark</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCompactMode((value) => !value)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-sm">Compact Mode</span>
                        <span className={`text-sm font-medium ${compactMode ? 'text-green-500' : 'text-yellow-500'}`}>
                          {compactMode ? 'Enabled' : 'Disabled'}
                        </span>
                      </button>
                    </div>
                  </GlassCard>
                )}

                {activeTab === 'account' && (
                  <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-400" />
                      Account
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm">Name</span>
                        <span className="text-sm text-white/60">{user?.name || 'User'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm">Email</span>
                        <span className="text-sm text-white/60">{user?.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {twoFactorModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
            <GlassCard className="w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">
                  {user?.isTwoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </h2>
                <button
                  type="button"
                  onClick={() => setTwoFactorModal(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {!user?.isTwoFactorEnabled && twoFactorSetup?.qrCode && (
                <div className="space-y-4 mb-5">
                  <div className="rounded-xl bg-white p-4">
                    <img src={twoFactorSetup.qrCode} alt="2FA QR code" className="w-full" />
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-white/40 mb-1">Manual setup key</p>
                    <p className="break-all font-mono text-sm text-white/80">{twoFactorSetup.secret}</p>
                  </div>
                </div>
              )}

              <form onSubmit={submit2FA} className="space-y-4">
                <AuthInput
                  label="Authenticator Code"
                  type="text"
                  placeholder="123456"
                  icon={Key}
                  value={twoFactorCode}
                  onChange={(event) => setTwoFactorCode(event.target.value)}
                />
                <AuthButton
                  type="submit"
                  loading={twoFactorLoading}
                  disabled={twoFactorCode.length !== 6 || (!user?.isTwoFactorEnabled && !twoFactorSetup)}
                >
                  {user?.isTwoFactorEnabled ? 'Disable 2FA' : 'Verify and Enable'}
                </AuthButton>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

export default Settings

import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Shield, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Zap,
  Lock,
  Globe,
  Server,
  Database,
  Mail,
  Calendar,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedBackground from '../components/AnimatedBackground'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { label: 'Security Score', value: '94%', icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Sessions', value: '3', icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Total Logins', value: '47', icon: Activity, color: 'text-secondary-500', bg: 'bg-secondary-500/10' },
    { label: 'Last Activity', value: '2 min ago', icon: Clock, color: 'text-accent-500', bg: 'bg-accent-500/10' },
  ]

  const recentActivity = [
    { action: 'Logged in from Chrome', time: '2 min ago', status: 'success', ip: '192.168.1.1' },
    { action: 'Password changed', time: '1 hour ago', status: 'success', ip: '192.168.1.1' },
    { action: 'Failed login attempt', time: '3 hours ago', status: 'failed', ip: '10.0.0.1' },
    { action: 'Email verified', time: '5 hours ago', status: 'success', ip: '192.168.1.1' },
    { action: 'New device login', time: '1 day ago', status: 'warning', ip: '203.0.113.1' },
  ]

  const securityBadges = [
    { label: 'Email Verified', icon: CheckCircle, color: 'text-green-500' },
    {
      label: user?.isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled',
      icon: user?.isTwoFactorEnabled ? CheckCircle : XCircle,
      color: user?.isTwoFactorEnabled ? 'text-green-500' : 'text-yellow-500',
    },
    { label: 'Password Strong', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Session Active', icon: CheckCircle, color: 'text-green-500' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">AuthLab</span>
              </motion.div>

              <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl px-3 py-1.5 border border-white/5">
                <Search className="w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-white/70 w-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/settings')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5 text-white/60" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </motion.button>
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/40">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
          </h1>
          <p className="text-white/40 mt-1">
            Here's what's happening with your account today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/40">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'failed' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-white/30">{activity.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/30">{activity.time}</span>
                      <MoreVertical className="w-4 h-4 text-white/20" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Security Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-6">Security Status</h2>
              <div className="space-y-4">
                {/* Security Score */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Security Score</span>
                    <span className="text-2xl font-bold gradient-text">94%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Badges */}
                {securityBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <span className="text-sm">{badge.label}</span>
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-white/40 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="p-3 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 transition-colors text-sm font-medium text-primary-400"
                  >
                    {user?.isTwoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white/60"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-12 pt-8 border-t border-white/5 text-center text-white/20 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Advanced Auth & Security Lab © 2026 — Built with ❤️ for security-first applications</p>
        </motion.footer>
      </main>
    </div>
  )
}

export default Dashboard

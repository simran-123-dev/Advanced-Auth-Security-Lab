import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const { login, verify2FALogin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [tempAccessToken, setTempAccessToken] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    const result = await login(data.email, data.password)
    setLoading(false)
    if (result.requires2FA) {
      setTempAccessToken(result.data.tempAccessToken)
      return
    }
    if (result.success) {
      navigate('/dashboard')
    }
  }

  const handleVerify2FA = async (event) => {
    event.preventDefault()
    setLoading(true)
    const result = await verify2FALogin(twoFactorToken, tempAccessToken)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/google'
  }

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/github'
  }

  return (
    <div className="auth-container">
      <AnimatedBackground />

      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
        {/* Left Side - Illustration */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center p-8 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative w-64 h-64"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full border-2 border-white/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white/40" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold gradient-text text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="text-white/60 text-center text-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Sign in to continue your journey with Advanced Auth & Security Lab
          </motion.p>

          <motion.div
            className="flex gap-4 text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Encrypted
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-500" />
              Trusted
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <GlassCard glow className="w-full max-w-md mx-auto lg:mx-0">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Sign In
              </motion.h1>
              <motion.p
                className="text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Enter your credentials to access your account
              </motion.p>
            </div>

            {/* Social Login */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <Chrome size={18} className="text-white/60" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <Github size={18} className="text-white/60" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0a0a0f] text-white/30">or continue with</span>
              </div>
            </div>

            {/* Form */}
            {tempAccessToken ? (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <AuthInput
                  label="Authenticator Code"
                  type="text"
                  placeholder="123456"
                  icon={Lock}
                  value={twoFactorToken}
                  onChange={(event) => setTwoFactorToken(event.target.value)}
                />
                <AuthButton type="submit" loading={loading} disabled={twoFactorToken.length !== 6}>
                  Verify 2FA
                  <ArrowRight size={18} className="ml-2 inline" />
                </AuthButton>
              </form>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />

              <AuthInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/20" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <AuthButton type="submit" loading={loading}>
                Sign In
                <ArrowRight size={18} className="ml-2 inline" />
              </AuthButton>
            </form>
            )}

            {/* Footer */}
            <motion.p
              className="text-center text-white/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create one
              </Link>
            </motion.p>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  )
}

export default Login

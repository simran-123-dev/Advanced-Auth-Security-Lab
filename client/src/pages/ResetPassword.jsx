import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ArrowRight, CheckCircle } from 'lucide-react'
import axios from 'axios'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

const resetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post(
        `http://localhost:5000/api/v1/auth/reset-password/${token}`,
        { password: data.password, confirmPassword: data.confirmPassword },
        { withCredentials: true }
      )
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <AnimatedBackground />
        <GlassCard glow className="w-full max-w-md mx-auto text-center">
          <motion.div
            className="py-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Password Reset! 🎉</h2>
              <p className="text-white/40">Your password has been changed successfully</p>
            </div>
            <Link to="/login" className="inline-block text-primary-400 hover:text-primary-300 transition-colors">
              Continue to Login →
            </Link>
          </motion.div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <AnimatedBackground />

      <GlassCard glow className="w-full max-w-md mx-auto">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-white/40 text-sm">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              type="password"
              label="New Password"
              placeholder="Enter new password"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />
            <AuthInput
              type="password"
              label="Confirm Password"
              placeholder="Confirm new password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <AuthButton type="submit" loading={loading}>
              Reset Password
              <ArrowRight size={18} className="ml-2 inline" />
            </AuthButton>
          </form>

          <p className="text-center text-white/40 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </GlassCard>
    </div>
  )
}

export default ResetPassword
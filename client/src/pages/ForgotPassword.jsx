import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import axios from 'axios'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/v1/auth/forgot-password', data, {
        withCredentials: true,
      })
      setSent(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
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
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {!sent ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-white/40 text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <AuthButton type="submit" loading={loading}>
                  Send Reset Link
                  <ArrowRight size={18} className="ml-2 inline" />
                </AuthButton>
              </form>
            </>
          ) : (
            <motion.div
              className="text-center py-8 space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">Check Your Email</h2>
              <p className="text-white/40 text-sm">
                We've sent a password reset link to your email address
              </p>
              <Link to="/login" className="inline-block text-primary-400 hover:text-primary-300 transition-colors text-sm">
                Return to login
              </Link>
            </motion.div>
          )}
        </motion.div>
      </GlassCard>
    </div>
  )
}

export default ForgotPassword
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/auth/verify-email/${token}`, {
          withCredentials: true,
        })
        setStatus('success')
        setMessage(response.data.data?.message || 'Email verified successfully!')
        setTimeout(() => navigate('/login'), 3000)
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.')
      }
    }

    if (token) {
      verifyEmail()
    }
  }, [token, navigate])

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
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-16 h-16 text-primary-500" />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {status === 'loading' && 'Verifying...'}
              {status === 'success' && 'Email Verified! 🎉'}
              {status === 'error' && 'Verification Failed'}
            </h2>
            <p className="text-white/40">{message}</p>
          </div>

          {status === 'success' && (
            <Link to="/login" className="inline-block text-primary-400 hover:text-primary-300 transition-colors">
              Continue to Login →
            </Link>
          )}

          {status === 'error' && (
            <Link to="/login" className="inline-block text-primary-400 hover:text-primary-300 transition-colors">
              Return to Login
            </Link>
          )}
        </motion.div>
      </GlassCard>
    </div>
  )
}

export default VerifyEmail
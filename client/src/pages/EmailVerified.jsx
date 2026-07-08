import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'

const EmailVerified = () => {
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">Email Verified! 🎉</h1>
            <p className="text-white/60">
              Your email has been successfully verified. You can now access all features.
            </p>
          </div>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all flex items-center gap-2 mx-auto"
            >
              Continue to Login
              <ArrowRight size={18} />
            </motion.button>
          </Link>

          <p className="text-xs text-white/20">
            You'll be redirected automatically in a few seconds
          </p>
        </motion.div>
      </GlassCard>
    </div>
  )
}

export default EmailVerified
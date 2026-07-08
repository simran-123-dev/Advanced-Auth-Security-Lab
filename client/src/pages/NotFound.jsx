import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'

const NotFound = () => {
  return (
    <div className="auth-container">
      <AnimatedBackground />

      <GlassCard glow className="w-full max-w-md mx-auto text-center">
        <motion.div
          className="space-y-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-32 h-32 mx-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-white/10">
              <AlertTriangle className="w-16 h-16 text-primary-400" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold gradient-text">404</h1>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-white/40">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25 flex items-center gap-2"
              >
                <Home size={18} />
                Go Home
              </motion.button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>
      </GlassCard>
    </div>
  )
}

export default NotFound
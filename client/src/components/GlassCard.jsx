import React from 'react'
import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', glow = false, ...props }) => {
  return (
    <motion.div
      className={`
        relative glass-dark premium-border rounded-3xl p-8 overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {glow && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
      )}
      {children}
    </motion.div>
  )
}

export default GlassCard

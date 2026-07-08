import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const AuthButton = ({
  children,
  loading = false,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 hover:from-primary-500 hover:via-accent-500 hover:to-secondary-400 shadow-lg shadow-primary-500/20 hover:shadow-secondary-500/20',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/10 shadow-lg shadow-black/20',
    outline: 'bg-transparent hover:bg-white/5 border border-white/20 hover:border-primary-400/50',
    ghost: 'bg-transparent hover:bg-white/5',
  }

  return (
    <motion.button
      className={`
        relative w-full py-3.5 px-6 rounded-xl font-semibold text-white
        transition-all duration-300 overflow-hidden tracking-wide
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
      {variant === 'primary' && !loading && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl"
            animate={{
              boxShadow: ['0 0 20px rgba(16,185,129,0.22)', '0 0 36px rgba(244,201,93,0.24)', '0 0 20px rgba(16,185,129,0.22)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
    </motion.button>
  )
}

export default AuthButton

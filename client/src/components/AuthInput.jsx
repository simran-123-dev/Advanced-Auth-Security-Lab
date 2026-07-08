import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const AuthInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white/70">
          {label}
          {required && <span className="text-primary-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center rounded-xl transition-all duration-300
            ${isFocused ? 'ring-2 ring-primary-400/30 shadow-lg shadow-primary-500/10' : ''}
            ${error ? 'ring-2 ring-red-500/40' : ''}
            ${success ? 'ring-2 ring-green-500/40' : ''}
          `}
          animate={{ scale: isFocused ? 1.01 : 1 }}
        >
          {Icon && (
            <div className="absolute left-3.5 text-white/35">
              <Icon size={18} />
            </div>
          )}
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 bg-white/[0.055] border border-white/10
              text-white placeholder-white/30 rounded-xl
              focus:outline-none transition-all duration-300
              ${Icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-12' : ''}
              ${error ? 'border-red-500/50' : ''}
              ${success ? 'border-green-500/50' : ''}
              ${isFocused ? 'border-primary-400/50 bg-white/[0.075]' : ''}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {success && !isPassword && (
            <div className="absolute right-3.5 text-green-500">
              <CheckCircle size={18} />
            </div>
          )}
        </motion.div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1.5 mt-1.5 text-red-400 text-sm"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AuthInput

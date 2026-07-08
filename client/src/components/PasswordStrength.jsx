import React from 'react'
import { motion } from 'framer-motion'

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0
    if (pass.length >= 8) score++
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score++
    if (pass.match(/[0-9]/)) score++
    if (pass.match(/[^a-zA-Z0-9]/)) score++
    if (pass.length >= 12) score++
    return score
  }

  const strength = getStrength(password)
  const maxStrength = 5
  const percentage = (strength / maxStrength) * 100

  const getColor = () => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-orange-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-green-400'
    return 'bg-green-500'
  }

  const getLabel = () => {
    if (strength <= 1) return 'Weak'
    if (strength <= 2) return 'Fair'
    if (strength <= 3) return 'Good'
    if (strength <= 4) return 'Strong'
    return 'Very Strong'
  }

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/40">Password strength</span>
        <span className={`font-medium ${getColor().replace('bg-', 'text-')}`}>
          {getLabel()}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {[...Array(maxStrength)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 rounded-full ${i < strength ? getColor() : 'bg-white/10'}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-1 text-xs text-white/40">
        <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-400' : ''}`}>
          {password.length >= 8 ? '✓' : '○'} 8+ characters
        </li>
        <li className={`flex items-center gap-1 ${password.match(/[A-Z]/) && password.match(/[a-z]/) ? 'text-green-400' : ''}`}>
          {password.match(/[A-Z]/) && password.match(/[a-z]/) ? '✓' : '○'} Uppercase & lowercase
        </li>
        <li className={`flex items-center gap-1 ${password.match(/[0-9]/) ? 'text-green-400' : ''}`}>
          {password.match(/[0-9]/) ? '✓' : '○'} Number
        </li>
        <li className={`flex items-center gap-1 ${password.match(/[^a-zA-Z0-9]/) ? 'text-green-400' : ''}`}>
          {password.match(/[^a-zA-Z0-9]/) ? '✓' : '○'} Special character
        </li>
      </ul>
    </div>
  )
}

export default PasswordStrength
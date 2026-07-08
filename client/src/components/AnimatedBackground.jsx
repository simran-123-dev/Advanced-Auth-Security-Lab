import React from 'react'
import { motion } from 'framer-motion'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050607]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(16,185,129,0.16),transparent_32%),linear-gradient(310deg,rgba(244,201,93,0.12),transparent_28%),linear-gradient(180deg,#050607,#080c0f_58%,#050607)]" />
      <motion.div
        className="absolute -left-24 top-0 h-[120vh] w-1/3 bg-gradient-to-b from-primary-500/12 via-accent-500/5 to-transparent blur-2xl"
        animate={{
          x: [0, 24, 0],
          opacity: [0.55, 0.8, 0.55],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -right-20 top-10 h-[120vh] w-1/3 bg-gradient-to-b from-secondary-500/10 via-primary-500/5 to-transparent blur-2xl"
        animate={{
          x: [0, -24, 0],
          opacity: [0.45, 0.72, 0.45],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.22)_55%,rgba(0,0,0,0.72)_100%)]" />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}

export default AnimatedBackground

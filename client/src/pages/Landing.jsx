import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Server,
  Database,
  Mail,
  Calendar,
  Clock
} from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption with JWT, bcrypt, and advanced security headers.',
      color: 'from-primary-500 to-secondary-500'
    },
    {
      icon: Lock,
      title: 'Two-Factor Auth',
      description: 'Protect accounts with TOTP-based 2FA and SMS verification options.',
      color: 'from-secondary-500 to-accent-500'
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Fine-grained access control with RBAC and admin dashboard.',
      color: 'from-accent-500 to-primary-500'
    },
    {
      icon: Zap,
      title: 'Blazing Fast',
      description: 'Optimized performance with Redis caching and efficient queries.',
      color: 'from-primary-500 to-accent-500'
    },
  ]

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Secure Sessions', value: '1M+' },
    { label: 'Uptime', value: '99.99%' },
    { label: 'Trust Score', value: 'A+' },
  ]

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 via-accent-400 to-secondary-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-wide">AuthLab</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <button type="button" onClick={() => scrollToSection('features')} className="text-white/60 hover:text-white transition-colors text-sm">Features</button>
              <button type="button" onClick={() => scrollToSection('security')} className="text-white/60 hover:text-white transition-colors text-sm">Security</button>
              <button type="button" onClick={() => scrollToSection('pricing')} className="text-white/60 hover:text-white transition-colors text-sm">Pricing</button>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-400 text-black shadow-lg shadow-primary-500/20 hover:shadow-secondary-500/25 transition-all"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 shadow-lg shadow-black/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-secondary-300" />
                <span className="text-sm text-white/75 font-medium">Security stack for modern teams</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-shadow-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Access control <br />
                with a <span className="gradient-text">premium</span> <br />
                security layer.
              </motion.h1>

              <motion.p
                className="text-lg text-white/60 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                A polished authentication lab with JWT sessions, 2FA, OAuth, profile controls, and a production-minded interface built to feel sharp in demos.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-primary-500 via-accent-400 to-secondary-400 text-black shadow-lg shadow-primary-500/20 hover:shadow-secondary-500/25 transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <motion.button
                type="button"
                onClick={() => scrollToSection('demo')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl font-semibold bg-white/[0.06] hover:bg-white/[0.11] border border-white/10 transition-all"
              >
                View Demo
              </motion.button>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-white/30">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <GlassCard glow className="p-8 relative">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 via-accent-400 to-secondary-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">AuthLab</p>
                      <p className="text-xs text-white/35">Security Command Center</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary-300">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Security Status', value: 'Protected', color: 'text-primary-300' },
                    { label: 'Active Sessions', value: '3 Devices', color: 'text-accent-300' },
                    { label: '2FA Coverage', value: 'Ready', color: 'text-secondary-300' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <span className="text-sm text-white/40">{item.label}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-white/20 text-center">
                    Protected sessions | Zero-trust architecture
                  </p>
                </div>
              </div>

              {/* Floating Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary-500/40"
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 1.5,
                    repeat: Infinity,
                  }}
                  style={{
                    top: `${20 + i * 30}%`,
                    left: `${10 + i * 40}%`,
                  }}
                />
              ))}
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for <span className="gradient-text">Security</span> at Scale
          </h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">
            Everything you need to build secure, production-ready applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full hover:scale-[1.02] transition-transform cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-3">Live Demo</h2>
            <p className="text-white/50 mb-6">
              Try the actual auth flow: create an account, verify security settings, then enable 2FA from Settings.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/register" className="p-4 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 transition-colors">
                <p className="font-semibold text-primary-300">Create Account</p>
                <p className="text-sm text-white/40 mt-1">Open the working register flow</p>
              </Link>
              <Link to="/login" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <p className="font-semibold text-white/80">Sign In</p>
                <p className="text-sm text-white/40 mt-1">Test login and 2FA verification</p>
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Demo Checklist</h3>
            <div className="space-y-3">
              {['Register with email and password', 'Log in with protected cookies', 'Enable authenticator-based 2FA', 'Manage security settings'].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Security <span className="gradient-text">Controls</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Lock, title: 'Password Hashing', copy: 'bcrypt password storage with strong validation rules.' },
            { icon: Shield, title: 'JWT Sessions', copy: 'HTTP-only cookies and refresh-token rotation.' },
            { icon: CheckCircle, title: '2FA Ready', copy: 'TOTP QR setup and login-time verification.' },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6">
              <item.icon className="w-8 h-8 text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/40">{item.copy}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GlassCard className="p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Pricing
          </h2>
          <p className="text-white/50 mb-6">
            This lab is ready to run locally for your project demo.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 font-semibold">
            Start Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/20">
            © 2026 Advanced Auth & Security Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/20 hover:text-white/40 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/20 hover:text-white/40 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/20 hover:text-white/40 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

import React, { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2,
  MapPin,
  Phone,
  Globe,
  Shield,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AnimatedBackground from '../components/AnimatedBackground'
import GlassCard from '../components/GlassCard'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import ProtectedRoute from '../components/ProtectedRoute'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

const Profile = () => {
  const { user, updateProfile, uploadAvatar } = useAuth()
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || '',
      website: user?.website || '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    await updateProfile(data)
    setLoading(false)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, GIF, or WEBP image')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setAvatarLoading(true)
    await uploadAvatar(file)
    setAvatarLoading(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">Profile</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <GlassCard className="lg:col-span-1 p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1">
                      <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-white">
                            {user?.name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarLoading}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-500 hover:bg-primary-600 transition-colors shadow-lg"
                    >
                      {avatarLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-white/40">{user?.email}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Verified Account</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-white/5">
                        <p className="text-white/40">Role</p>
                        <p className="font-medium capitalize">{user?.role || 'User'}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <p className="text-white/40">Joined</p>
                        <p className="font-medium">
                          {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Edit Profile */}
              <GlassCard className="lg:col-span-2 p-6">
                <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AuthInput
                    label="Full Name"
                    placeholder="John Doe"
                    icon={User}
                    error={errors.name?.message}
                    {...register('name')}
                  />

                  <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <AuthInput
                    label="Bio"
                    placeholder="Tell us about yourself"
                    icon={User}
                    error={errors.bio?.message}
                    {...register('bio')}
                  />

                  <AuthInput
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    icon={Phone}
                    error={errors.phone?.message}
                    {...register('phone')}
                  />

                  <AuthInput
                    label="Location"
                    placeholder="New York, USA"
                    icon={MapPin}
                    error={errors.location?.message}
                    {...register('location')}
                  />

                  <AuthInput
                    label="Website"
                    placeholder="https://example.com"
                    icon={Globe}
                    error={errors.website?.message}
                    {...register('website')}
                  />

                  <div className="pt-4">
                    <AuthButton type="submit" loading={loading} disabled={!isDirty}>
                      <Save size={18} className="mr-2 inline" />
                      Save Changes
                    </AuthButton>
                  </div>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Profile

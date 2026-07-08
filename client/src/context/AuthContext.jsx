import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()
const ACCESS_TOKEN_KEY = 'authlab_access_token'

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    delete axios.defaults.headers.common.Authorization
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  axios.defaults.withCredentials = true
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

  useEffect(() => {
    setAuthHeader(localStorage.getItem(ACCESS_TOKEN_KEY))
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check`)
      if (response.data?.data?.user) {
        setUser(response.data.data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      if (response.data?.data?.requires2FA) {
        return { success: true, requires2FA: true, data: response.data.data }
      }
      if (response.data?.data?.user) {
        if (response.data.data.accessToken) {
          setAuthHeader(response.data.data.accessToken)
        }
        setUser(response.data.data.user)
        setIsAuthenticated(true)
        toast.success('Welcome back!')
        return { success: true, data: response.data.data }
      }
      return { success: false, error: 'Login failed' }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const verify2FALogin = async (token, tempAccessToken) => {
    try {
      const response = await axios.post(`${API_URL}/auth/2fa/verify-login`, {
        token,
        tempAccessToken,
      })
      if (response.data?.data?.user) {
        if (response.data.data.accessToken) {
          setAuthHeader(response.data.data.accessToken)
        }
        setUser(response.data.data.user)
        setIsAuthenticated(true)
        toast.success('2FA verified')
        return { success: true, data: response.data.data }
      }
      return { success: false, error: '2FA verification failed' }
    } catch (error) {
      const message = error.response?.data?.message || '2FA verification failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`)
      setAuthHeader(null)
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
      return { success: true }
    } catch (error) {
      setAuthHeader(null)
      setUser(null)
      setIsAuthenticated(false)
      toast.error('Logout failed')
      return { success: false, error: 'Logout failed' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      toast.success('Account created! Please verify your email.')
      return { success: true, data: response.data.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/users/update-profile`, data)
      if (response.data?.data?.user) {
        setUser(response.data.data.user)
        toast.success('Profile updated successfully')
      }
      return { success: true, data: response.data.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await axios.post(`${API_URL}/users/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data?.data?.user) {
        setUser(response.data.data.user)
        toast.success('Avatar uploaded successfully')
      }
      return { success: true, data: response.data.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const changePassword = async (data) => {
    try {
      await axios.post(`${API_URL}/users/change-password`, data)
      toast.success('Password changed successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const setup2FA = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/2fa/setup`)
      return { success: true, data: response.data.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to start 2FA setup'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const verify2FA = async (token, setupToken) => {
    try {
      await axios.post(`${API_URL}/auth/2fa/verify`, { token, setupToken })
      await checkAuth()
      toast.success('2FA enabled successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid 2FA code'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const disable2FA = async (token) => {
    try {
      await axios.post(`${API_URL}/auth/2fa/disable`, { token })
      await checkAuth()
      toast.success('2FA disabled')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to disable 2FA'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    verify2FALogin,
    logout,
    register,
    updateProfile,
    uploadAvatar,
    changePassword,
    setup2FA,
    verify2FA,
    disable2FA,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

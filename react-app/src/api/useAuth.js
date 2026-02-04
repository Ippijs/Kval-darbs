import { useState, useEffect } from 'react'
import { authAPI } from './client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    const response = await authAPI.login(username, password)
    setUser(response.data.user)
    return response.data
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  return { user, loading, login, logout }
}

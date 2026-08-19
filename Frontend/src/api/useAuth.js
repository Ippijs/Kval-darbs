import { useState, useEffect } from 'react'
import { authAPI } from './client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrates auth state from the current backend session.
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

  // Clears backend session and local auth state.
  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  // Allows pages to sync user updates after profile changes.
  const setCurrentUser = setUser

  return { user, loading, login, logout, setCurrentUser }
}

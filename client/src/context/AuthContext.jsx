"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      // You could also fetch user data here using the token
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  const isAuthenticated = () => {
    return !!token
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


import { create } from 'zustand'
import { loginApi, logoutApi } from '../api/auth'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isLoading: false,
  error: null,
  isInitializing: true,

  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const { token, user } = await loginApi(credentials)

      localStorage.setItem('auth_token', token)

      set({
        user,
        token,
        isLoading: false,
        isInitializing: false
      })

      return { success: true }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed.'

      set({
        isLoading: false,
        error: msg,
      })

      return { success: false, error: msg }
    }
  },

  logout: async () => {
    try {
      await logoutApi()
    } catch {}

    localStorage.removeItem('auth_token')

    set({
      user: null,
      token: null,
      isInitializing: false
    })
  },

  setUser: (user) => set({ user, isInitializing: false }),
}))

export default useAuthStore
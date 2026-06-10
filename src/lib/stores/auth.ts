import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { loginUser, registerUser } from '../api'
import { supabase } from '../supabase'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (telefono: string) => Promise<void>
  register: (telefono: string, nombre: string, role: User['role']) => Promise<void>
  logout: () => void
  clearError: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (telefono) => {
        set({ isLoading: true, error: null })
        try {
          const user = await loginUser(telefono)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      register: async (telefono, nombre, role) => {
        set({ isLoading: true, error: null })
        try {
          const user = await registerUser(telefono, nombre, role)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      logout: () => {
        supabase.auth.signOut()
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'mercaonline-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false })
  }
})

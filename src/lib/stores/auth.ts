import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { loginUser, registerUser } from '../api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (telefono: string) => Promise<void>
  register: (telefono: string, nombre: string, role: User['role']) => Promise<void>
  logout: () => void
  clearError: () => void
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
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mercafruit-auth',
      // Solo persiste user e isAuthenticated, no el estado de carga
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import type { User } from '@/lib/types'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'mercaonline2024admin'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (usuario === ADMIN_USER && contrasena === ADMIN_PASS) {
      const adminUser: User = {
        id: 'admin-001',
        telefono: '',
        nombre: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }
      setUser(adminUser)
      navigate('/app/admin', { replace: true })
    } else {
      setError('Usuario o contrasena incorrectos')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#1B3A2A' }}
    >
      <h1
        className="text-4xl text-white mb-10 text-center"
        style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}
      >
        MercaOnline
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white px-8 py-10 flex flex-col gap-5"
        style={{ borderRadius: 16 }}
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="usuario"
            className="text-sm font-semibold text-gray-700"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => { setUsuario(e.target.value); setError(null) }}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-700 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
            autoComplete="username"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="contrasena"
            className="text-sm font-semibold text-gray-700"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Contrasena
          </label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => { setContrasena(e.target.value); setError(null) }}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-700 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-1 w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: '#F28C28', fontFamily: 'Inter, sans-serif' }}
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

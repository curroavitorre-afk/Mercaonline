import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import type { Role } from '@/lib/types'

const ROLE_HOME: Record<Role, string> = {
  frutero: '/app/frutero',
  proveedor: '/app/proveedor',
  repartidor: '/app/frutero',
  admin: '/app/admin',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [telefono, setTelefono] = useState('')

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    await login(telefono.trim())
    const { user } = useAuthStore.getState()
    if (user) navigate(from ?? ROLE_HOME[user.role], { replace: true })
  }

  return (
    <main
      className="min-h-screen flex flex-col justify-center px-6 py-12"
      style={{ backgroundColor: '#1B3A2A' }}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <Link to="/" className="block text-center mb-10">
          <span className="text-2xl font-black text-white tracking-tight font-serif">MercaOnline</span>
        </Link>

        <div className="bg-white p-7 shadow-2xl" style={{ borderRadius: 24 }}>
          <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Bienvenido de vuelta</h1>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Entra con tu número de teléfono</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-1" style={{ color: '#222222' }}>
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                required
                autoComplete="tel"
                placeholder="600 000 000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="block w-full px-4 py-3 text-sm outline-none transition-all"
                style={{
                  color: '#222222',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A2A')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 text-sm"
                style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 12, color: '#DC2626' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !telefono.trim()}
              className="w-full text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97A1E' }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
            >
              {isLoading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>

          {/* Usuarios de demo */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E5E7EB' }}>
            <p className="text-xs text-center mb-3" style={{ color: '#9CA3AF' }}>Usuarios de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTelefono('600000001')}
                className="px-3 py-2 text-left transition-colors"
                style={{ borderRadius: 10, backgroundColor: '#F8F7F3', border: '1px solid #E5E7EB' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F5F1')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F3')}
              >
                <p className="text-xs font-medium" style={{ color: '#222222' }}>Frutero</p>
                <p className="text-xs font-mono" style={{ color: '#6B7280' }}>600000001</p>
              </button>
              <button
                type="button"
                onClick={() => setTelefono('600000002')}
                className="px-3 py-2 text-left transition-colors"
                style={{ borderRadius: 10, backgroundColor: '#F8F7F3', border: '1px solid #E5E7EB' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F5F1')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F3')}
              >
                <p className="text-xs font-medium" style={{ color: '#222222' }}>Proveedor</p>
                <p className="text-xs font-mono" style={{ color: '#6B7280' }}>600000002</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ¿No tienes cuenta?{' '}
          <Link
            to="/registro"
            className="font-medium transition-colors"
            style={{ color: '#6F9E7B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6F9E7B')}
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  )
}

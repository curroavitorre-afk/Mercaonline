import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import type { Role } from '@/lib/types'

type RolePublico = 'frutero' | 'proveedor'

const ROLE_HOME: Record<Role, string> = {
  frutero: '/app/frutero',
  proveedor: '/app/proveedor',
  repartidor: '/app/frutero',
  admin: '/app/admin',
}

function IconShop() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7H3l1 9h16l1-9z" />
      <path d="M10 7V5a2 2 0 0 1 4 0v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
    </svg>
  )
}

export default function RegistroPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isLoading, error, clearError } = useAuthStore()

  const preselectedRole = (location.state as { role?: RolePublico } | null)?.role ?? 'frutero'

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [role, setRole] = useState<RolePublico>(preselectedRole)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    await register(telefono.trim(), nombre.trim(), role)
    const { user } = useAuthStore.getState()
    if (user) navigate(ROLE_HOME[user.role], { replace: true })
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
          <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Crear cuenta</h1>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Sin tarjeta. Sin compromisos.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de rol */}
            <fieldset>
              <legend className="block text-sm font-medium mb-2" style={{ color: '#222222' }}>Soy…</legend>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className="flex flex-col items-center gap-2 p-3 cursor-pointer transition-all"
                  style={{
                    border: `2px solid ${role === 'frutero' ? '#1B3A2A' : '#E5E7EB'}`,
                    borderRadius: 12,
                    backgroundColor: role === 'frutero' ? '#F0F5F1' : '#FFFFFF',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="frutero"
                    className="sr-only"
                    checked={role === 'frutero'}
                    onChange={() => setRole('frutero')}
                  />
                  <span style={{ color: role === 'frutero' ? '#1B3A2A' : '#9CA3AF' }}>
                    <IconShop />
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#222222' }}>Frutero</span>
                </label>

                <label
                  className="flex flex-col items-center gap-2 p-3 cursor-pointer transition-all"
                  style={{
                    border: `2px solid ${role === 'proveedor' ? '#1B3A2A' : '#E5E7EB'}`,
                    borderRadius: 12,
                    backgroundColor: role === 'proveedor' ? '#F0F5F1' : '#FFFFFF',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="proveedor"
                    className="sr-only"
                    checked={role === 'proveedor'}
                    onChange={() => setRole('proveedor')}
                  />
                  <span style={{ color: role === 'proveedor' ? '#1B3A2A' : '#9CA3AF' }}>
                    <IconStore />
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#222222' }}>Puesto en lonja</span>
                </label>
              </div>
            </fieldset>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1" style={{ color: '#222222' }}>
                {role === 'frutero' ? 'Nombre de tu frutería' : 'Nombre del puesto'}
              </label>
              <input
                id="nombre"
                type="text"
                required
                autoComplete="name"
                placeholder={role === 'frutero' ? 'Frutería García' : 'Frutas García — Puesto 12'}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full px-4 py-3 text-sm outline-none transition-all"
                style={{ color: '#222222', border: '1px solid #E5E7EB', borderRadius: 12 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A2A')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            {/* Teléfono */}
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
                style={{ color: '#222222', border: '1px solid #E5E7EB', borderRadius: 12 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A2A')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
              <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
                Usaremos este número para identificarte
              </p>
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
              disabled={isLoading || !nombre.trim() || !telefono.trim()}
              className="w-full text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97A1E' }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
            >
              {isLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-medium transition-colors"
            style={{ color: '#6F9E7B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6F9E7B')}
          >
            Entra aquí
          </Link>
        </p>
      </div>
    </main>
  )
}

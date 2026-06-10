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

export default function RegistroPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isLoading, error, clearError } = useAuthStore()

  // Pre-selección de role si viene de la landing (navigate state)
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
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <Link to="/" className="block text-center mb-10">
          <span className="text-2xl font-black text-white tracking-tight">🍊 MercaFruit</span>
        </Link>

        <div className="bg-white rounded-3xl p-7 shadow-2xl">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Crear cuenta</h1>
          <p className="text-sm text-slate-500 mb-6">Sin tarjeta. Sin compromisos.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de role */}
            <fieldset>
              <legend className="block text-sm font-medium text-slate-700 mb-2">Soy…</legend>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                    role === 'frutero'
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="frutero"
                    className="sr-only"
                    checked={role === 'frutero'}
                    onChange={() => setRole('frutero')}
                  />
                  <span className="text-2xl">🍊</span>
                  <span className="text-sm font-medium text-slate-800">Frutero</span>
                </label>

                <label
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                    role === 'proveedor'
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="proveedor"
                    className="sr-only"
                    checked={role === 'proveedor'}
                    onChange={() => setRole('proveedor')}
                  />
                  <span className="text-2xl">🥦</span>
                  <span className="text-sm font-medium text-slate-800">Puesto en lonja</span>
                </label>
              </div>
            </fieldset>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
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
                className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">
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
                className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <p className="mt-1 text-xs text-slate-400">
                Usaremos este número para identificarte
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !nombre.trim() || !telefono.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              {isLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
            Entra aquí
          </Link>
        </p>
      </div>
    </main>
  )
}

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

  // Redirigir al origen si venía de una ruta protegida
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearError()
    await login(telefono.trim())
    const { user } = useAuthStore.getState()
    if (user) navigate(from ?? ROLE_HOME[user.role], { replace: true })
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <Link to="/" className="block text-center mb-10">
          <span className="text-2xl font-black text-white tracking-tight">🍊 MercaFruit</span>
        </Link>

        <div className="bg-white rounded-3xl p-7 shadow-2xl">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Bienvenido de vuelta</h1>
          <p className="text-sm text-slate-500 mb-6">Entra con tu número de teléfono</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !telefono.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              {isLoading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>

          {/* Usuarios de demo */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3 text-center">Usuarios de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTelefono('600000001')}
                className="rounded-lg bg-slate-50 hover:bg-slate-100 px-3 py-2 text-left transition-colors"
              >
                <p className="text-xs font-medium text-slate-700">🍊 Frutero</p>
                <p className="text-xs text-slate-400 font-mono">600000001</p>
              </button>
              <button
                type="button"
                onClick={() => setTelefono('600000002')}
                className="rounded-lg bg-slate-50 hover:bg-slate-100 px-3 py-2 text-left transition-colors"
              >
                <p className="text-xs font-medium text-slate-700">🥦 Proveedor</p>
                <p className="text-xs text-slate-400 font-mono">600000002</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-green-400 hover:text-green-300 font-medium">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </main>
  )
}

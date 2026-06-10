import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { supabase } from '@/lib/supabase'
import { loginUser, registerUser } from '@/lib/api'
import type { Role } from '@/lib/types'

type RolePublico = 'frutero' | 'proveedor'
type Step = 'datos' | 'codigo'

const MOCK_PHONES = ['600000001', '600000002']

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
  const { setUser } = useAuthStore()

  const preselectedRole = (location.state as { role?: RolePublico } | null)?.role ?? 'frutero'

  const [step, setStep] = useState<Step>('datos')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [role, setRole] = useState<RolePublico>(preselectedRole)
  const [codigos, setCodigos] = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (step === 'codigo') {
      const timer = setTimeout(() => inputRefs.current[0]?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [step])

  async function handleEnviarCodigo(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const num = telefono.trim()

    setIsLoading(true)
    try {
      if (MOCK_PHONES.includes(num)) {
        // Para números de prueba, hacer login directo (ya existen en la BD)
        const user = await loginUser(num)
        setUser(user)
        navigate(ROLE_HOME[user.role], { replace: true })
        return
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({ phone: `+34${num}` })
      if (otpError) throw new Error(otpError.message)
      setStep('codigo')
      setCountdown(30)
    } catch (err) {
      setError('No se pudo enviar el código. Comprueba el número e inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerificarCodigo(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const token = codigos.join('')
    if (token.length < 6) return

    setIsLoading(true)
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+34${telefono.trim()}`,
        token,
        type: 'sms',
      })
      if (verifyError) throw new Error(verifyError.message)

      const user = await registerUser(telefono.trim(), nombre.trim(), role)
      setUser(user)
      navigate(ROLE_HOME[user.role], { replace: true })
    } catch (err) {
      const msg = (err as Error).message
      if (msg === 'El teléfono ya está registrado') {
        setError('Este número ya tiene cuenta. Entra con tu teléfono.')
      } else if (msg.toLowerCase().includes('token') || msg.toLowerCase().includes('otp')) {
        setError('Código incorrecto, inténtalo de nuevo.')
        setCodigos(Array(6).fill(''))
        setTimeout(() => inputRefs.current[0]?.focus(), 20)
      } else {
        setError(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReenviar() {
    setError(null)
    setIsLoading(true)
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({ phone: `+34${telefono.trim()}` })
      if (otpError) throw new Error(otpError.message)
      setCountdown(30)
      setCodigos(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 20)
    } catch {
      setError('No se pudo reenviar el código.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const next = [...codigos]
    next[index] = digit
    setCodigos(next)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleDigitKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !codigos[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const next = Array(6).fill('')
    pasted.split('').forEach((d, i) => { next[i] = d })
    setCodigos(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <main
      className="min-h-screen flex flex-col justify-center px-6 py-12"
      style={{ backgroundColor: '#1B3A2A' }}
    >
      <div className="w-full max-w-sm mx-auto">
        <Link to="/" className="block text-center mb-10">
          <span className="text-2xl font-black text-white tracking-tight font-serif">MercaOnline</span>
        </Link>

        <div className="bg-white p-7 shadow-2xl" style={{ borderRadius: 24 }}>
          {step === 'datos' ? (
            <>
              <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Crear cuenta</h1>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Sin tarjeta. Sin compromisos.</p>

              <form onSubmit={handleEnviarCodigo} className="space-y-4">
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
                  <div
                    className="flex items-center"
                    style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}
                  >
                    <span
                      className="px-3 py-3 text-sm font-medium select-none shrink-0"
                      style={{ backgroundColor: '#F8F7F3', color: '#6B7280', borderRight: '1px solid #E5E7EB' }}
                    >
                      +34
                    </span>
                    <input
                      id="telefono"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="600 000 000"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="flex-1 px-3 py-3 text-sm outline-none"
                      style={{ color: '#222222' }}
                    />
                  </div>
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
                    {error.includes('ya tiene cuenta') && (
                      <>{' '}<Link to="/login" className="font-medium underline">Entrar</Link></>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !nombre.trim() || telefono.trim().length < 9}
                  className="w-full text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97A1E' }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
                >
                  {isLoading ? 'Enviando…' : 'Recibir código'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Verifica tu número</h1>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Hemos enviado un código al{' '}
                <span className="font-medium" style={{ color: '#222222' }}>+34 {telefono}</span>
              </p>

              <form onSubmit={handleVerificarCodigo} className="space-y-5">
                <div className="flex gap-2 justify-between">
                  {codigos.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="w-10 h-12 text-center text-lg font-bold outline-none transition-all"
                      style={{
                        border: `1px solid ${digit ? '#1B3A2A' : '#E5E7EB'}`,
                        borderRadius: 10,
                        color: '#222222',
                        backgroundColor: digit ? '#F0F5F1' : '#FFFFFF',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A2A')}
                      onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.style.borderColor = '#E5E7EB' }}
                    />
                  ))}
                </div>

                {error && (
                  <div
                    className="px-4 py-3 text-sm"
                    style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 12, color: '#DC2626' }}
                  >
                    {error}
                    {error.includes('ya tiene cuenta') && (
                      <>{' '}<Link to="/login" className="font-medium underline">Entrar</Link></>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || codigos.join('').length < 6}
                  className="w-full text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97A1E' }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
                >
                  {isLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep('datos'); setError(null); setCodigos(Array(6).fill('')) }}
                  className="text-sm"
                  style={{ color: '#6B7280' }}
                >
                  ← Cambiar datos
                </button>
                <button
                  type="button"
                  onClick={handleReenviar}
                  disabled={countdown > 0 || isLoading}
                  className="text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: '#1B3A2A' }}
                >
                  {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
                </button>
              </div>
            </>
          )}
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

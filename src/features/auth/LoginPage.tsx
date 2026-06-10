import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { supabase } from '@/lib/supabase'
import { loginUser } from '@/lib/api'
import { MOCK_USERS } from '@/lib/mock-data'
import type { Role } from '@/lib/types'

const MOCK_PHONES = ['600000001', '600000002']

const ROLE_HOME: Record<Role, string> = {
  frutero: '/app/frutero',
  proveedor: '/app/proveedor',
  repartidor: '/app/repartidor',
  admin: '/app/admin',
}

type Step = 'telefono' | 'codigo'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()

  const [step, setStep] = useState<Step>('telefono')
  const [telefono, setTelefono] = useState('')
  const [codigos, setCodigos] = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [demoMode, setDemoMode] = useState<'frutero' | 'proveedor' | null>(null)
  const [showRepartidorAccess, setShowRepartidorAccess] = useState(false)
  const [repartidorPassword, setRepartidorPassword] = useState('')
  const [repartidorError, setRepartidorError] = useState<string | null>(null)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname

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
        const user = await loginUser(num)
        setUser(user)
        navigate(from ?? ROLE_HOME[user.role], { replace: true })
        return
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({ phone: `+34${num}` })
      if (otpError) throw new Error(otpError.message)
      setStep('codigo')
      setCountdown(30)
    } catch (err) {
      const msg = (err as Error).message
      if (msg === 'Teléfono no registrado') {
        setError('Este número no tiene cuenta. ¿Quieres registrarte?')
      } else {
        setError('No se pudo enviar el código. Comprueba el número e inténtalo de nuevo.')
      }
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
      if (demoMode && token === '123456') {
        const mockUser = MOCK_USERS.find(u => u.telefono === telefono.trim())
        if (mockUser) {
          setUser(mockUser)
          navigate(from ?? ROLE_HOME[mockUser.role], { replace: true })
        }
        return
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+34${telefono.trim()}`,
        token,
        type: 'sms',
      })
      if (verifyError) throw new Error(verifyError.message)

      const user = await loginUser(telefono.trim())
      setUser(user)
      navigate(from ?? ROLE_HOME[user.role], { replace: true })
    } catch (err) {
      const msg = (err as Error).message
      if (msg === 'Teléfono no registrado') {
        setError('Este número no tiene cuenta. ¿Quieres registrarte?')
      } else {
        setError('Código incorrecto, inténtalo de nuevo.')
      }
      setCodigos(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 20)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReenviar() {
    setError(null)
    if (demoMode) {
      setCodigos(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 20)
      return
    }
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

  function handleDemoOtp(phone: string, role: 'frutero' | 'proveedor') {
    setDemoMode(role)
    setTelefono(phone)
    setError(null)
    setCodigos(Array(6).fill(''))
    setStep('codigo')
    setCountdown(30)
  }

  async function handleRepartidorAccess(e: FormEvent) {
    e.preventDefault()
    setRepartidorError(null)
    if (repartidorPassword !== 'mercaonline2024') {
      setRepartidorError('Código incorrecto')
      return
    }
    const mockUser = MOCK_USERS.find(u => u.telefono === '600000003')
    if (!mockUser) return
    setUser(mockUser)
    navigate(from ?? ROLE_HOME[mockUser.role], { replace: true })
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
          {step === 'telefono' ? (
            <>
              <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Bienvenido de vuelta</h1>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Entra con tu número de teléfono</p>

              <form onSubmit={handleEnviarCodigo} className="space-y-4">
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
                </div>

                {error && (
                  <div
                    className="px-4 py-3 text-sm"
                    style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 12, color: '#DC2626' }}
                  >
                    {error}
                    {error.includes('registrarte') && (
                      <>{' '}<Link to="/registro" className="font-medium underline">Regístrate</Link></>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || telefono.trim().length < 9}
                  className="w-full text-white font-semibold px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#D97A1E' }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
                >
                  {isLoading ? 'Enviando…' : 'Recibir código'}
                </button>
              </form>

              <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E5E7EB' }}>
                <p
                  className="text-xs text-center font-medium tracking-widest mb-4"
                  style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                >
                  ACCESO DEMO
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoOtp('600000001', 'frutero')}
                    className="w-full text-white text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#1B3A2A', borderRadius: 12, padding: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Entrar como Frutero
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoOtp('600000002', 'proveedor')}
                    className="w-full text-white text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#6F9E7B', borderRadius: 12, padding: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Entrar como Puesto
                  </button>
                  {!showRepartidorAccess ? (
                    <button
                      type="button"
                      onClick={() => { setShowRepartidorAccess(true); setRepartidorError(null); setRepartidorPassword('') }}
                      className="w-full text-sm transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', border: '1px solid #1B3A2A', borderRadius: 12, padding: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    >
                      Acceso Repartidor
                    </button>
                  ) : (
                    <form onSubmit={handleRepartidorAccess} className="flex flex-col gap-2">
                      <input
                        type="password"
                        placeholder="Código de acceso"
                        value={repartidorPassword}
                        onChange={(e) => setRepartidorPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm outline-none"
                        style={{ border: '1px solid #E5E7EB', borderRadius: 12, color: '#222222', fontFamily: 'Inter, sans-serif' }}
                        autoFocus
                      />
                      {repartidorError && (
                        <p className="text-xs px-1" style={{ color: '#DC2626' }}>{repartidorError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full text-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', border: '1px solid #1B3A2A', borderRadius: 12, padding: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                      >
                        Entrar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-1 font-serif" style={{ color: '#222222' }}>Introduce el código</h1>
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
                    {error.includes('registrarte') && (
                      <>{' '}<Link to="/registro" className="font-medium underline">Regístrate</Link></>
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
                  {isLoading ? 'Verificando…' : 'Entrar'}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep('telefono'); setError(null); setCodigos(Array(6).fill('')); setDemoMode(null) }}
                  className="text-sm"
                  style={{ color: '#6B7280' }}
                >
                  ← Cambiar número
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

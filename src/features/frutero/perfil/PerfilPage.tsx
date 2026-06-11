import { useAuthStore } from '@/lib/stores/auth'
import BottomNav from '@/components/BottomNav'
import CartIcon from '@/components/CartIcon'
import { useNavigate } from 'react-router-dom'

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

interface InfoCardProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div
      className="flex items-center gap-4 bg-white px-4 py-4"
      style={{ border: '1px solid #E5E7EB', borderRadius: 16 }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: '#6B7280' }}>{label}</p>
        <p className="text-sm font-medium truncate" style={{ color: '#222222' }}>{value}</p>
      </div>
      <span style={{ color: '#D1D5DB' }}>
        <IconChevron />
      </span>
    </div>
  )
}

export default function PerfilPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const iniciales = user?.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() ?? 'MO'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera con fondo verde bosque */}
      <div
        className="px-4 pt-12 pb-8 text-white relative"
        style={{ backgroundColor: '#1B3A2A' }}
      >
        <button
          onClick={() => navigate('/app/frutero')}
          className="text-[11px] font-bold block mb-4"
          style={{ color: '#FFFFFF', fontFamily: 'Fraunces, serif', letterSpacing: '0.03em' }}
        >
          MercaOnline
        </button>
        <div className="absolute top-4 right-4">
          <CartIcon iconColor="white" />
        </div>
        <div className="flex flex-col items-center text-center">
          {/* Avatar con iniciales */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold font-serif"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            {iniciales}
          </div>
          <h1 className="text-xl font-bold font-serif text-white">{user?.nombre ?? 'Mi frutería'}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Frutero · MercaOnline</p>

          {/* Badge activo */}
          <div
            className="mt-3 px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'rgba(111,158,123,0.3)', color: '#6F9E7B', borderRadius: 20, border: '1px solid rgba(111,158,123,0.4)' }}
          >
            Cuenta activa
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3">
        {/* Sección: Datos de contacto */}
        <p className="text-xs font-semibold uppercase tracking-wide px-1 mb-2" style={{ color: '#6B7280', letterSpacing: '0.1em' }}>
          Datos de contacto
        </p>

        <InfoCard
          icon={<IconPhone />}
          label="Teléfono"
          value={user?.telefono ?? '—'}
        />
        <InfoCard
          icon={<IconMapPin />}
          label="Dirección de entrega"
          value="Por configurar"
        />

        {/* Sección: Pago */}
        <p className="text-xs font-semibold uppercase tracking-wide px-1 mt-5 mb-2" style={{ color: '#6B7280', letterSpacing: '0.1em' }}>
          Pago
        </p>

        <InfoCard
          icon={<IconCard />}
          label="Método de pago"
          value="Por configurar"
        />

        {/* Sección: Cuenta */}
        <p className="text-xs font-semibold uppercase tracking-wide px-1 mt-5 mb-2" style={{ color: '#6B7280', letterSpacing: '0.1em' }}>
          Cuenta
        </p>

        {/* ID de cuenta */}
        <div
          className="bg-white px-4 py-4"
          style={{ border: '1px solid #E5E7EB', borderRadius: 16 }}
        >
          <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Identificador</p>
          <p className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{user?.id ?? '—'}</p>
        </div>

        {/* Botón cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 font-medium py-3.5 mt-2 transition-colors"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            color: '#DC2626',
          }}
        >
          <IconLogOut />
          <span>Cerrar sesión</span>
        </button>

        <p className="text-center text-xs pt-2" style={{ color: '#D1D5DB' }}>
          MercaOnline v1.0 · Mercagranada
        </p>
      </div>

      <BottomNav />
    </div>
  )
}

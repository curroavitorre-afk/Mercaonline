import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { MOCK_PROVEEDORES } from '@/lib/mock-data'
import BottomNavProveedor from '@/components/BottomNavProveedor'
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight'

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
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

export default function PerfilProveedorPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const bottomNavHeight = useBottomNavHeight()

  const miProveedor = MOCK_PROVEEDORES.find((p) => p.userId === user?.id) ?? MOCK_PROVEEDORES[0]

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!miProveedor) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Inter, sans-serif', color:'#6B7280'}}>
        Cargando...
      </div>
    )
  }

  const iniciales = miProveedor.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const estaAprobado = miProveedor.estadoAprobacion === 'aprobado'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: bottomNavHeight }}>
      {/* Cabecera verde */}
      <div className="px-4 pt-12 pb-8 text-white" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold font-serif"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            {iniciales}
          </div>
          <h1 className="text-xl font-bold font-serif text-white">{miProveedor.nombre}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Proveedor · Mercagranada
          </p>
          <div
            className="mt-3 px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: estaAprobado ? 'rgba(111,158,123,0.3)' : 'rgba(251,191,36,0.2)',
              color: estaAprobado ? '#6F9E7B' : '#FCD34D',
              borderRadius: 20,
              border: estaAprobado ? '1px solid rgba(111,158,123,0.4)' : '1px solid rgba(251,191,36,0.3)',
            }}
          >
            {estaAprobado ? 'Cuenta activa' : 'Pendiente de aprobación'}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide px-1 mb-2" style={{ color: '#6B7280', letterSpacing: '0.1em' }}>
          Datos del puesto
        </p>

        <InfoCard
          icon={<IconStore />}
          label="Nombre del puesto"
          value={miProveedor.nombre}
        />
        <InfoCard
          icon={<IconPhone />}
          label="Teléfono de contacto"
          value={user?.telefono ?? '—'}
        />

        <p className="text-xs font-semibold uppercase tracking-wide px-1 mt-5 mb-2" style={{ color: '#6B7280', letterSpacing: '0.1em' }}>
          Cuenta
        </p>

        <div
          className="bg-white px-4 py-4"
          style={{ border: '1px solid #E5E7EB', borderRadius: 16 }}
        >
          <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Identificador</p>
          <p className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{user?.id ?? '—'}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 font-medium py-3.5 mt-2"
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

      <BottomNavProveedor />
    </div>
  )
}

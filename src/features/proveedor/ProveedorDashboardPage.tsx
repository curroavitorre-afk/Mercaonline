import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { MOCK_PROVEEDORES, MOCK_PRODUCTOS } from '@/lib/mock-data'
import BottomNavProveedor from '@/components/BottomNavProveedor'

function IconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
}

function IconTrending() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

export default function ProveedorDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const miProveedor = MOCK_PROVEEDORES.find((p) => p.userId === user?.id) ?? MOCK_PROVEEDORES[0]

  if (!miProveedor) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Inter, sans-serif', color:'#6B7280'}}>
        Cargando...
      </div>
    )
  }

  const misProductos = MOCK_PRODUCTOS.filter((p) => p.proveedorId === miProveedor.id)
  const productosActivos = misProductos.filter((p) => p.activo).length

  const iniciales = (user?.nombre ?? miProveedor.nombre)
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: '80px' }}>
      {/* Cabecera verde */}
      <div className="px-4 pt-12 pb-8 text-white" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold font-serif shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}
          >
            {iniciales}
          </div>
          <div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Bienvenido,</p>
            <h1 className="text-lg font-bold font-serif text-white leading-tight">{miProveedor.nombre}</h1>
          </div>
        </div>

        {/* Stats del día */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pedidos mañana', valor: '3' },
            { label: 'Productos activos', valor: String(productosActivos) },
            { label: 'Facturado hoy', valor: '142 €' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl py-3 px-2 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <p className="text-xl font-bold font-serif text-white">{stat.valor}</p>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Acceso rápido */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3 px-1" style={{ color: '#9CA3AF', letterSpacing: '0.1em' }}>
            Acceso rápido
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/proveedor/catalogo')}
              className="w-full bg-white flex items-center gap-4 px-4 py-4 text-left active:bg-gray-50"
              style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A' }}
              >
                <IconTag />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#222222' }}>Mi catálogo</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  {misProductos.length} producto{misProductos.length !== 1 ? 's' : ''} · {productosActivos} activo{productosActivos !== 1 ? 's' : ''}
                </p>
              </div>
              <span style={{ color: '#D1D5DB' }}><IconChevron /></span>
            </button>

            <button
              onClick={() => navigate('/app/proveedor/pedidos')}
              className="w-full bg-white flex items-center gap-4 px-4 py-4 text-left active:bg-gray-50"
              style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FEF3E8', color: '#F28C28' }}
              >
                <IconClipboard />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#222222' }}>Pedidos recibidos</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>3 pedidos para mañana</p>
              </div>
              <span style={{ color: '#D1D5DB' }}><IconChevron /></span>
            </button>
          </div>
        </div>

        {/* Productos más pedidos */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3 px-1" style={{ color: '#9CA3AF', letterSpacing: '0.1em' }}>
            Más pedidos esta semana
          </p>
          <div
            className="bg-white"
            style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', overflow: 'hidden' }}
          >
            {misProductos.slice(0, 3).map((producto, i) => (
              <div
                key={producto.id}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < misProductos.slice(0, 3).length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A' }}
                  >
                    <IconTrending />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#222222' }}>{producto.nombre}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{producto.precio.toFixed(2)} € / {producto.unidad}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1"
                  style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 20 }}
                >
                  {([48, 32, 27] as const)[i] ?? 10} kg
                </span>
              </div>
            ))}

            {misProductos.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Sin datos esta semana</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavProveedor />
    </div>
  )
}

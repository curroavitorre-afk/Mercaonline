import { useAuthStore } from '@/lib/stores/auth'
import { MOCK_PROVEEDORES } from '@/lib/mock-data'
import BottomNavProveedor from '@/components/BottomNavProveedor'

type EstadoPedidoProveedor = 'pendiente' | 'confirmado' | 'recogido'

interface LineaPedidoProveedor {
  nombre: string
  cantidad: number
  unidad: string
}

interface PedidoProveedor {
  id: string
  fruteroRef: string
  lineas: LineaPedidoProveedor[]
  horaRecogida: string
  estado: EstadoPedidoProveedor
}

const PEDIDOS_MOCK: PedidoProveedor[] = [
  {
    id: 'pp1',
    fruteroRef: 'Frutería #01',
    lineas: [
      { nombre: 'Naranjas Valencia', cantidad: 50, unidad: 'kg' },
      { nombre: 'Limones', cantidad: 20, unidad: 'kg' },
    ],
    horaRecogida: '04:00 – 05:00',
    estado: 'confirmado',
  },
  {
    id: 'pp2',
    fruteroRef: 'Frutería #02',
    lineas: [
      { nombre: 'Naranjas Valencia', cantidad: 30, unidad: 'kg' },
    ],
    horaRecogida: '04:00 – 05:00',
    estado: 'pendiente',
  },
  {
    id: 'pp3',
    fruteroRef: 'Frutería #03',
    lineas: [
      { nombre: 'Limones', cantidad: 15, unidad: 'kg' },
    ],
    horaRecogida: '04:30 – 05:30',
    estado: 'pendiente',
  },
]

const ESTADO_CONFIG: Record<EstadoPedidoProveedor, { label: string; bg: string; color: string }> = {
  pendiente: { label: 'Pendiente', bg: '#FEF3C7', color: '#92400E' },
  confirmado: { label: 'Confirmado', bg: '#D1FAE5', color: '#065F46' },
  recogido: { label: 'Recogido', bg: '#EEF2FF', color: '#4338CA' },
}

function IconBox() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  )
}

export default function PedidosProveedorPage() {
  const { user } = useAuthStore()
  const miProveedor = MOCK_PROVEEDORES.find((p) => p.userId === user?.id) ?? MOCK_PROVEEDORES[0]

  if (!miProveedor) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Inter, sans-serif', color:'#6B7280'}}>
        Cargando...
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: '80px' }}>
      {/* Cabecera */}
      <div className="bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Pedidos recibidos</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          {miProveedor.nombre} · entrega mañana
        </p>
      </div>

      {PEDIDOS_MOCK.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconBox />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            Sin pedidos de momento
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Los pedidos para mañana aparecerán aquí a partir de las 20:00.
          </p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          {/* Banner resumen */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: '#F0F5F1', borderRadius: 12, border: '1px solid #D4E8DA' }}
          >
            <span className="text-lg font-bold font-serif" style={{ color: '#1B3A2A' }}>
              {PEDIDOS_MOCK.length}
            </span>
            <p className="text-sm" style={{ color: '#1B3A2A' }}>
              pedidos para mañana · recogida entre las{' '}
              <span className="font-semibold">4:00 y las 5:30</span>
            </p>
          </div>

          {PEDIDOS_MOCK.map((pedido) => {
            const cfg = ESTADO_CONFIG[pedido.estado]
            return (
              <div
                key={pedido.id}
                className="bg-white overflow-hidden"
                style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Cabecera pedido */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between">
                  <div>
                    <p className="font-bold font-serif" style={{ color: '#222222' }}>
                      {pedido.fruteroRef}
                    </p>
                    <div className="flex items-center gap-1 mt-1" style={{ color: '#6B7280' }}>
                      <IconClock />
                      <span className="text-xs">Recogida {pedido.horaRecogida}</span>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, borderRadius: 20 }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Líneas del pedido */}
                <div className="px-4 pb-4" style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: '#9CA3AF', letterSpacing: '0.1em' }}
                  >
                    Productos solicitados
                  </p>
                  <div className="space-y-2">
                    {pedido.lineas.map((linea) => (
                      <div key={linea.nombre} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#222222' }}>
                          {linea.nombre}
                        </span>
                        <span
                          className="text-xs font-semibold px-2.5 py-1"
                          style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', borderRadius: 20 }}
                        >
                          {linea.cantidad} {linea.unidad}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BottomNavProveedor />
    </div>
  )
}

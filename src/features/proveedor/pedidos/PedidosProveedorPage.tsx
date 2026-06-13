import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { getProveedorByUserId, getOrdersForProveedor, getFruteros } from '@/lib/api'
import type { Order, OrderStatus, Proveedor, User } from '@/lib/types'
import BottomNavProveedor from '@/components/BottomNavProveedor'

const ESTADO_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  confirmado:  { label: 'Pendiente',  bg: '#FEF3C7', color: '#92400E' },
  en_recogida: { label: 'En recogida', bg: '#FEF3C7', color: '#92400E' },
  recogido:    { label: 'Recogido',   bg: '#D1FAE5', color: '#065F46' },
  en_reparto:  { label: 'Preparado',  bg: '#D1FAE5', color: '#065F46' },
  entregado:   { label: 'Entregado',  bg: '#EEF2FF', color: '#4338CA' },
  incidencia:  { label: 'Incidencia', bg: '#FEE2E2', color: '#991B1B' },
}

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#E5E7EB" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="#1B3A2A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function PedidosProveedorPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [pedidos, setPedidos] = useState<Order[]>([])
  const [fruterosMap, setFruterosMap] = useState<Record<string, User>>({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!user) return
    getProveedorByUserId(user.id)
      .then((p) => {
        if (!p) {
          setCargando(false)
          return
        }
        setProveedor(p)
        return Promise.all([getOrdersForProveedor(p.id), getFruteros()])
      })
      .then((result) => {
        if (!result) return
        const [ords, fruteros] = result
        setPedidos(ords)
        setFruterosMap(Object.fromEntries(fruteros.map((f) => [f.id, f])))
      })
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [user])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7F3' }}>
        <Spinner />
      </div>
    )
  }

  if (!proveedor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7F3', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        Sin puesto asociado
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div className="bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 shrink-0"
            style={{ color: '#222222', backgroundColor: '#F0F5F1', borderRadius: 8 }}
          >
            <IconBack />
          </button>
          <button onClick={() => navigate('/')} className="block text-left">
            <span className="text-[11px] font-semibold" style={{ color: '#1B3A2A', fontFamily: 'Fraunces, serif' }}>MercaOnline</span>
            <span className="text-[9px] block mt-0.5" style={{ color: '#9CA3AF' }}>Inicio</span>
          </button>
        </div>
        <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Pedidos recibidos</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          {proveedor.nombre}
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconBox />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            Sin pedidos de momento
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Los pedidos aparecerán aquí cuando un frutero confirme un pedido de tu puesto.
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
              {pedidos.length}
            </span>
            <p className="text-sm" style={{ color: '#1B3A2A' }}>
              {pedidos.length === 1 ? 'pedido recibido' : 'pedidos recibidos'} · recogida entre las{' '}
              <span className="font-semibold">4:00 y las 5:30</span>
            </p>
          </div>

          {pedidos.map((pedido) => {
            const frutero = fruterosMap[pedido.fruteroId]
            const fruteroNombre = frutero?.nombre ?? 'Frutería'
            const cfg = ESTADO_CONFIG[pedido.estado]
            const fecha = new Date(pedido.fechaConfirmacion).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })

            return (
              <div
                key={pedido.id}
                className="bg-white overflow-hidden"
                style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Cabecera pedido */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#9CA3AF' }}>{fecha}</p>
                    <p className="font-bold font-serif" style={{ color: '#222222' }}>
                      {fruteroNombre}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                    </p>
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
                      <div key={linea.productoId} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#222222' }}>
                          {linea.nombreProducto}
                        </span>
                        <span
                          className="text-xs font-semibold px-2.5 py-1"
                          style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', borderRadius: 20 }}
                        >
                          {linea.cantidad} {linea.precioUnitario > 0 ? `· ${(linea.subtotal).toFixed(2)} €` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <span className="text-sm" style={{ color: '#6B7280' }}>Subtotal tu puesto</span>
                    <span className="text-sm font-bold font-serif" style={{ color: '#1B3A2A' }}>
                      {pedido.lineas.reduce((acc, l) => acc + l.subtotal, 0).toFixed(2)} €
                    </span>
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

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { getOrdersDelDiaRepartidor, updateOrderStatus } from '@/lib/api'
import type { Order, OrderStatus } from '@/lib/types'
import BottomNavRepartidor from '@/components/BottomNavRepartidor'
import {
  IS_UUID,
  MOCK_ORDERS_HOY,
  PUESTO_INFO,
  ENTREGA_INFO,
  PRODUCTO_UNIDAD,
} from './mockData'

type EstadoEntrega = 'pendiente' | 'en_camino' | 'entregado'

function toEstadoEntrega(estado: OrderStatus): EstadoEntrega {
  if (estado === 'entregado') return 'entregado'
  if (estado === 'en_reparto') return 'en_camino'
  return 'pendiente'
}

const CHIP: Record<EstadoEntrega, { bg: string; color: string; label: string }> = {
  pendiente: { bg: '#F3F4F6', color: '#6B7280', label: 'Pendiente' },
  en_camino: { bg: '#FFF3E0', color: '#F28C28', label: 'En camino' },
  entregado: { bg: '#DCFCE7', color: '#15803D', label: 'Entregado' },
}

function fechaHoy() {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function IconCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

export default function RutaPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [recogidoHecho, setRecogidoHecho] = useState(false)
  const [foto, setFoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    if (!IS_UUID.test(user.id)) {
      setOrders(MOCK_ORDERS_HOY.map((o) => ({ ...o })))
      setLoading(false)
      return
    }
    getOrdersDelDiaRepartidor(user.id)
      .then(setOrders)
      .catch(() => setOrders(MOCK_ORDERS_HOY.map((o) => ({ ...o }))))
      .finally(() => setLoading(false))
  }, [user])

  // Aggregate lines by proveedorId, merging duplicate product names
  const puestos = new Map<string, { nombreProducto: string; cantidad: number }[]>()
  for (const order of orders) {
    for (const linea of order.lineas) {
      const items = puestos.get(linea.proveedorId) ?? []
      const existing = items.find((i) => i.nombreProducto === linea.nombreProducto)
      if (existing) {
        existing.cantidad += linea.cantidad
      } else {
        items.push({ nombreProducto: linea.nombreProducto, cantidad: linea.cantidad })
      }
      puestos.set(linea.proveedorId, items)
    }
  }

  function handleFoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function avanzarEntrega(order: Order) {
    const displayEstado = toEstadoEntrega(order.estado)
    const next: OrderStatus = displayEstado === 'en_camino' ? 'entregado' : 'en_reparto'
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, estado: next } : o)))
    if (IS_UUID.test(order.id)) {
      await updateOrderStatus(order.id, next).catch(() => {})
    }
  }

  const totalParadas = orders.length > 0 ? 1 + orders.length : 0

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="px-5 pt-12 pb-6" style={{ backgroundColor: '#1B3A2A' }}>
          <div className="h-7 w-40 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Cargando ruta…</p>
        </div>
        <BottomNavRepartidor />
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Header */}
      <header className="px-5 pt-12 pb-6" style={{ backgroundColor: '#1B3A2A' }}>
        <button
          onClick={() => navigate('/app/repartidor')}
          className="text-[11px] font-bold block mb-3"
          style={{ color: '#FFFFFF', fontFamily: 'Fraunces, serif', letterSpacing: '0.03em' }}
        >
          MercaOnline
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Mi ruta de hoy
            </h1>
            <p className="text-sm mt-1 capitalize" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {fechaHoy()}
            </p>
          </div>
          {totalParadas > 0 && (
            <span
              className="shrink-0 text-sm font-semibold px-3 py-1.5 rounded-full mt-1"
              style={{ backgroundColor: '#F28C28', color: '#FFFFFF' }}
            >
              {totalParadas} paradas
            </span>
          )}
        </div>
      </header>

      <div className="px-4 py-5 space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>No tienes pedidos asignados hoy.</p>
          </div>
        ) : (
          <>
            {/* Recogida section */}
            <section>
              <h2
                className="text-xs font-semibold tracking-widest mb-3 px-1"
                style={{ color: '#6B7280' }}
              >
                RECOGIDA EN MERCAGRANADA
              </h2>

              <div
                className="bg-white rounded-2xl p-5"
                style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-baseline gap-2 mb-5">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: '#F28C28', fontFamily: 'Fraunces, serif' }}
                  >
                    04:00 AM
                  </span>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>Mercagranada</span>
                </div>

                <div className="space-y-4">
                  {[...puestos.entries()].map(([proveedorId, items], idx, arr) => {
                    const info = PUESTO_INFO[proveedorId]
                    const isLast = idx === arr.length - 1
                    return (
                      <div
                        key={proveedorId}
                        className={isLast ? '' : 'pb-4'}
                        style={isLast ? {} : { borderBottom: '1px solid #F3F4F6' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm" style={{ color: '#1B3A2A' }}>
                            {info?.nombre ?? `Puesto ${proveedorId}`}
                          </p>
                          {info && (
                            <span className="text-xs" style={{ color: '#9CA3AF' }}>
                              Pab. {info.pabellon} · Puesto {info.puesto}
                            </span>
                          )}
                        </div>
                        <ul className="space-y-1.5">
                          {items.map((item, i) => {
                            const unidad = PRODUCTO_UNIDAD[item.nombreProducto] ?? 'ud.'
                            return (
                              <li key={i} className="flex items-center justify-between">
                                <span className="text-sm" style={{ color: '#374151' }}>
                                  {item.nombreProducto}
                                </span>
                                <span
                                  className="text-sm font-semibold tabular-nums"
                                  style={{ color: '#111827' }}
                                >
                                  {item.cantidad} {unidad}
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                {/* Foto del género */}
                <div className="mt-5 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFoto}
                  />

                  {foto ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={foto}
                        alt="Foto del género"
                        className="w-full object-cover"
                        style={{ maxHeight: 200 }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#FFFFFF' }}
                      >
                        Cambiar foto
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl"
                      style={{
                        border: '1.5px dashed #D1D5DB',
                        color: '#6B7280',
                        backgroundColor: '#FAFAF9',
                      }}
                    >
                      <IconCamera />
                      Fotografiar género
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setRecogidoHecho(true)}
                    disabled={recogidoHecho}
                    className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-colors disabled:cursor-default"
                    style={{
                      backgroundColor: recogidoHecho ? '#6B7280' : '#F28C28',
                    }}
                  >
                    {recogidoHecho ? 'Todo recogido' : 'Marcar todo recogido'}
                  </button>
                </div>
              </div>
            </section>

            {/* Entregas section */}
            <section>
              <h2
                className="text-xs font-semibold tracking-widest mb-3 px-1"
                style={{ color: '#6B7280' }}
              >
                ENTREGAS
              </h2>

              <div className="space-y-3">
                {orders.map((order, idx) => {
                  const info = ENTREGA_INFO[order.id]
                  const displayEstado = toEstadoEntrega(order.estado)
                  const chip = CHIP[displayEstado]

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4"
                      style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Número de parada */}
                        <div
                          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: '#1B3A2A' }}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm leading-tight" style={{ color: '#111827' }}>
                              {info?.fruteria ?? `Pedido #${order.id.slice(-6).toUpperCase()}`}
                            </p>
                            <span
                              className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: chip.bg, color: chip.color }}
                            >
                              {chip.label}
                            </span>
                          </div>
                          {info && (
                            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                              {info.direccion}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            {info && (
                              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                                Est. {info.hora}
                              </span>
                            )}
                            <span className="text-xs" style={{ color: '#9CA3AF' }}>
                              {order.total.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>

                      {displayEstado !== 'entregado' && (
                        <button
                          type="button"
                          onClick={() => avanzarEntrega(order)}
                          className="mt-3 w-full text-sm font-medium py-2.5 rounded-xl transition-opacity hover:opacity-85"
                          style={{
                            backgroundColor: displayEstado === 'en_camino' ? '#F28C28' : '#F0F5F1',
                            color: displayEstado === 'en_camino' ? '#FFFFFF' : '#1B3A2A',
                          }}
                        >
                          {displayEstado === 'en_camino' ? 'Confirmar entrega' : 'Salir en ruta'}
                        </button>
                      )}

                      {displayEstado === 'entregado' && (
                        <div
                          className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl"
                          style={{ backgroundColor: '#DCFCE7' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-sm font-medium" style={{ color: '#15803D' }}>
                            Entregado
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>

      <BottomNavRepartidor />
    </main>
  )
}

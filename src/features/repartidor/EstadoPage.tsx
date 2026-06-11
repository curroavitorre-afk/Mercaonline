import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { getOrdersDelDiaRepartidor, updateOrderStatus } from '@/lib/api'
import type { Order, OrderStatus } from '@/lib/types'
import BottomNavRepartidor from '@/components/BottomNavRepartidor'
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight'
import { IS_UUID, MOCK_ORDERS_HOY, ENTREGA_INFO } from './mockData'

const PASOS: OrderStatus[] = ['confirmado', 'en_recogida', 'recogido', 'en_reparto', 'entregado']

const PASO_LABELS: Record<OrderStatus, string> = {
  confirmado: 'Confirmado',
  en_recogida: 'En lonja',
  recogido: 'Recogido',
  en_reparto: 'En ruta',
  entregado: 'Entregado',
  incidencia: 'Incidencia',
}

const SIGUIENTE: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmado: 'en_recogida',
  en_recogida: 'recogido',
  recogido: 'en_reparto',
  en_reparto: 'entregado',
}

const BOTON_LABELS: Partial<Record<OrderStatus, string>> = {
  confirmado: 'Ir a Mercagranada',
  en_recogida: 'Marcar recogido',
  recogido: 'Salir en ruta',
  en_reparto: 'Marcar entregado',
}

function IconCheck({ color = 'white', size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

interface StepperProps {
  estado: OrderStatus
}

function Stepper({ estado }: StepperProps) {
  const pasoActual = PASOS.indexOf(estado)

  return (
    <div className="mb-1">
      <div className="flex items-center">
        {PASOS.map((paso, i) => {
          const done = i <= pasoActual
          const current = i === pasoActual
          const isLast = i === PASOS.length - 1

          return (
            <div key={paso} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: current
                    ? '#F28C28'
                    : done
                      ? '#1B3A2A'
                      : '#F3F4F6',
                  border: `2px solid ${current ? '#F28C28' : done ? '#1B3A2A' : '#E5E7EB'}`,
                }}
              >
                {done && !current ? (
                  <IconCheck />
                ) : (
                  <span
                    className="text-[9px] font-bold leading-none"
                    style={{ color: current ? '#FFFFFF' : '#9CA3AF' }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  className="flex-1 h-0.5 mx-1"
                  style={{ backgroundColor: i < pasoActual ? '#1B3A2A' : '#E5E7EB' }}
                />
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs font-medium mt-2" style={{ color: '#1B3A2A' }}>
        {PASO_LABELS[estado]}
      </p>
    </div>
  )
}

export default function EstadoPage() {
  const user = useAuthStore((s) => s.user)
  const bottomNavHeight = useBottomNavHeight()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

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

  async function avanzar(order: Order) {
    const siguiente = SIGUIENTE[order.estado]
    if (!siguiente || updating) return

    setUpdating(order.id)
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, estado: siguiente } : o)),
    )

    if (IS_UUID.test(order.id)) {
      await updateOrderStatus(order.id, siguiente).catch(() => {})
    }

    setUpdating(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: bottomNavHeight }}>
        <div className="px-5 pt-12 pb-6" style={{ backgroundColor: '#1B3A2A' }}>
          <div className="h-7 w-48 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Cargando pedidos…</p>
        </div>
        <BottomNavRepartidor />
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: bottomNavHeight }}>
      {/* Header */}
      <header className="px-5 pt-12 pb-6" style={{ backgroundColor: '#1B3A2A' }}>
        <h1
          className="text-2xl font-bold text-white leading-tight"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Actualizar estado
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} asignados hoy
        </p>
      </header>

      <div className="px-4 py-5 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>No tienes pedidos asignados hoy.</p>
          </div>
        ) : (
          orders.map((order) => {
            const info = ENTREGA_INFO[order.id]
            const siguiente = SIGUIENTE[order.estado]
            const isUpdating = updating === order.id

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5"
                style={{ border: '1px solid #E5E7EB', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#111827' }}>
                      {info?.fruteria ?? `Pedido #${order.id.slice(-6).toUpperCase()}`}
                    </p>
                    {info && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#6B7280' }}>
                        {info.direccion}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium" style={{ color: '#111827' }}>
                      {order.total.toFixed(2)} €
                    </p>
                    {info && (
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        Est. {info.hora}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stepper */}
                <Stepper estado={order.estado} />

                {/* Action button */}
                <div className="mt-4">
                  {siguiente ? (
                    <button
                      type="button"
                      onClick={() => avanzar(order)}
                      disabled={isUpdating}
                      className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: '#F28C28' }}
                    >
                      {isUpdating ? 'Actualizando…' : BOTON_LABELS[order.estado]}
                    </button>
                  ) : order.estado === 'entregado' ? (
                    <div
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl"
                      style={{ backgroundColor: '#DCFCE7' }}
                    >
                      <IconCheck color="#15803D" size={14} />
                      <span className="text-sm font-medium" style={{ color: '#15803D' }}>
                        Entregado
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNavRepartidor />
    </main>
  )
}

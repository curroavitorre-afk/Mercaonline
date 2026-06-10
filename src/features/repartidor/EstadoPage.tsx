import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { getOrdersDelDiaRepartidor, updateOrderStatus } from '@/lib/api'
import type { Order, OrderStatus } from '@/lib/types'

const ESTADO_LABELS: Record<OrderStatus, string> = {
  confirmado: 'Confirmado',
  en_recogida: 'En Mercagranada',
  recogido: 'Recogido',
  en_reparto: 'En ruta',
  entregado: 'Entregado',
  incidencia: 'Incidencia',
}

const ESTADO_COLORS: Record<OrderStatus, string> = {
  confirmado: 'bg-gray-100 text-gray-600',
  en_recogida: 'bg-blue-100 text-blue-700',
  recogido: 'bg-yellow-100 text-yellow-700',
  en_reparto: 'bg-orange-100 text-orange-700',
  entregado: 'bg-green-100 text-green-700',
  incidencia: 'bg-red-100 text-red-700',
}

// Progresión lineal de estados que maneja el repartidor
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

export default function EstadoPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cargar = () => {
    if (!user) return
    setLoading(true)
    getOrdersDelDiaRepartidor(user.id)
      .then(setOrders)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [user])

  async function avanzar(order: Order) {
    const siguiente = SIGUIENTE[order.estado]
    if (!siguiente) return
    setUpdating(order.id)
    setError(null)
    try {
      await updateOrderStatus(order.id, siguiente)
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, estado: siguiente } : o)),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <main className="px-4 py-6">
        <p className="text-sm text-gray-400">Cargando…</p>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-4 px-4 py-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1.5rem)' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Estado de entregas</h1>
        <Link to="/app/repartidor" className="text-sm text-gray-500">
          ← Ruta
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No tienes pedidos asignados hoy.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const siguiente = SIGUIENTE[order.estado]
            const isUpdating = updating === order.id

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${ESTADO_COLORS[order.estado]}`}
                  >
                    {ESTADO_LABELS[order.estado]}
                  </span>
                </div>

                <p className="text-xs text-gray-400">
                  {order.lineas.length} producto{order.lineas.length !== 1 ? 's' : ''}{' '}
                  · {order.total.toFixed(2)} €
                </p>

                {siguiente ? (
                  <button
                    onClick={() => avanzar(order)}
                    disabled={isUpdating}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {isUpdating ? 'Actualizando…' : BOTON_LABELS[order.estado]}
                  </button>
                ) : order.estado === 'entregado' ? (
                  <p className="text-xs text-center text-green-600 font-medium py-1">
                    Entregado ✓
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

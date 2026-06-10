import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { getOrdersDelDiaRepartidor } from '@/lib/api'
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

export default function RutaPage() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getOrdersDelDiaRepartidor(user.id)
      .then(setOrders)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  // Agrupar todas las líneas por proveedor para mostrar qué recoger en cada puesto
  const puestos = new Map<string, { nombreProducto: string; cantidad: number; pedidoId: string }[]>()
  for (const order of orders) {
    for (const linea of order.lineas) {
      const items = puestos.get(linea.proveedorId) ?? []
      items.push({
        nombreProducto: linea.nombreProducto,
        cantidad: linea.cantidad,
        pedidoId: order.id,
      })
      puestos.set(linea.proveedorId, items)
    }
  }

  if (loading) {
    return (
      <main className="px-4 py-6">
        <p className="text-sm text-gray-400">Cargando ruta…</p>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6 px-4 py-6" style={{ paddingBottom: 'env(safe-area-inset-bottom, 1.5rem)' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Mi ruta de hoy</h1>
        <Link
          to="/app/repartidor/estado"
          className="text-sm font-medium text-green-600"
        >
          Estados →
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
        <>
          <p className="text-sm text-gray-500">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} asignados
          </p>

          {/* Qué recoger en cada puesto */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Qué recoger y dónde
            </h2>
            {[...puestos.entries()].map(([proveedorId, items]) => (
              <div
                key={proveedorId}
                className="bg-white border border-gray-200 rounded-2xl p-4"
              >
                <p className="text-xs text-gray-400 font-mono mb-3">
                  Puesto {proveedorId.slice(-8).toUpperCase()}
                </p>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-800">{item.nombreProducto}</span>
                      <span className="font-semibold text-gray-900 tabular-nums">
                        ×{item.cantidad}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* A dónde entregar cada pedido */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Entregas
            </h2>
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    Pedido #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.lineas.length} producto{order.lineas.length !== 1 ? 's' : ''}{' '}
                    · {order.total.toFixed(2)} €
                  </p>
                  {order.notas && (
                    <p className="text-xs text-amber-600 mt-1 truncate">{order.notas}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${ESTADO_COLORS[order.estado]}`}
                >
                  {ESTADO_LABELS[order.estado]}
                </span>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  )
}

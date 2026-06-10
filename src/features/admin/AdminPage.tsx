import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import {
  getProveedoresPendientes,
  aprobarProveedor,
  rechazarProveedor,
  getAllOrdersToday,
} from '@/lib/api'
import type { Proveedor, Order, OrderStatus } from '@/lib/types'

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

const DOT_COLORS: Record<OrderStatus, string> = {
  confirmado: 'bg-gray-400',
  en_recogida: 'bg-blue-500',
  recogido: 'bg-yellow-500',
  en_reparto: 'bg-orange-500',
  entregado: 'bg-green-500',
  incidencia: 'bg-red-500',
}

const ORDEN_ESTADOS: OrderStatus[] = [
  'confirmado',
  'en_recogida',
  'recogido',
  'en_reparto',
  'entregado',
  'incidencia',
]

export default function AdminPage() {
  const user = useAuthStore((s) => s.user)
  const [pendientes, setPendientes] = useState<Proveedor[]>([])
  const [pedidos, setPedidos] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cargar = () => {
    setLoading(true)
    setError(null)
    Promise.all([getProveedoresPendientes(), getAllOrdersToday()])
      .then(([prov, ords]) => {
        setPendientes(prov)
        setPedidos(ords)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  async function handleAprobar(id: string) {
    if (!user) return
    setActionLoading(id)
    setError(null)
    try {
      await aprobarProveedor(id, user.id)
      setPendientes((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRechazar(id: string) {
    if (!user) return
    setActionLoading(id)
    setError(null)
    try {
      await rechazarProveedor(id, user.id)
      setPendientes((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <main
      className="flex flex-col gap-6 px-4 py-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 1.5rem)' }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Administración</h1>
        <button
          onClick={cargar}
          disabled={loading}
          className="text-sm font-medium text-green-600 disabled:text-gray-300"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Cargando…</p>
      ) : (
        <>
          {/* ── Proveedores pendientes ──────────────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Proveedores pendientes
              {pendientes.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {pendientes.length}
                </span>
              )}
            </h2>

            {pendientes.length === 0 ? (
              <p className="text-sm text-gray-400">Ningún proveedor pendiente.</p>
            ) : (
              <div className="space-y-3">
                {pendientes.map((prov) => (
                  <div
                    key={prov.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4"
                  >
                    <p className="font-semibold text-gray-900">{prov.nombre}</p>
                    {prov.descripcion && (
                      <p className="text-sm text-gray-400 mt-0.5">{prov.descripcion}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAprobar(prov.id)}
                        disabled={actionLoading === prov.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(prov.id)}
                        disabled={actionLoading === prov.id}
                        className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-sm font-medium py-2 rounded-xl transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Estado de la ruta (tiempo real) ────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Estado de la ruta
            </h2>
            {pedidos.length === 0 ? (
              <p className="text-sm text-gray-400">Sin actividad hoy.</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                {ORDEN_ESTADOS.map((estado) => {
                  const count = pedidos.filter((o) => o.estado === estado).length
                  if (count === 0) return null
                  return (
                    <div key={estado} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${DOT_COLORS[estado]}`} />
                        <span className="text-sm text-gray-700">{ESTADO_LABELS[estado]}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* ── Todos los pedidos del día ───────────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              Pedidos de hoy
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {pedidos.length}
              </span>
            </h2>

            {pedidos.length === 0 ? (
              <p className="text-sm text-gray-400">Sin pedidos hoy.</p>
            ) : (
              <div className="space-y-2">
                {pedidos.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.lineas.length} prod. · {order.total.toFixed(2)} €
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${ESTADO_COLORS[order.estado]}`}
                    >
                      {ESTADO_LABELS[order.estado]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

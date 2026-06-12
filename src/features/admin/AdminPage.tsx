import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import {
  getProveedoresPendientes,
  aprobarProveedor,
  rechazarProveedor,
  getAllOrdersToday,
  getAllOrdersSemana,
  getAllProveedores,
  getFruteros,
} from '@/lib/api'
import { getFase, setFase } from '@/lib/config'
import type { Fase } from '@/lib/config'
import type { Proveedor, Order, OrderStatus, User } from '@/lib/types'

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
  const [pedidosSemana, setPedidosSemana] = useState<Order[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [fruteros, setFruteros] = useState<User[]>([])
  const [fase, setFaseState] = useState<Fase | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingFase, setLoadingFase] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cargar = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      getProveedoresPendientes(),
      getAllOrdersToday(),
      getAllOrdersSemana(),
      getAllProveedores(),
      getFruteros(),
      getFase(),
    ])
      .then(([prov, ords, ordsSemana, allProvs, fruts, faseActual]) => {
        setPendientes(prov)
        setPedidos(ords)
        setPedidosSemana(ordsSemana)
        setProveedores(allProvs)
        setFruteros(fruts)
        setFaseState(faseActual)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  async function handleSetFase(nuevaFase: Fase) {
    if (nuevaFase === fase || loadingFase) return
    setLoadingFase(true)
    setError(null)
    try {
      await setFase(nuevaFase)
      setFaseState(nuevaFase)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cambiar fase')
    } finally {
      setLoadingFase(false)
    }
  }

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

  function getProductoMasPedido(): string {
    const counts: Record<string, number> = {}
    for (const order of pedidosSemana) {
      for (const linea of order.lineas) {
        counts[linea.nombreProducto] = (counts[linea.nombreProducto] ?? 0) + linea.cantidad
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] ?? '—'
  }

  function getPuestoMasSolicitado(): string {
    const counts: Record<string, number> = {}
    for (const order of pedidosSemana) {
      const vistos = new Set<string>()
      for (const linea of order.lineas) {
        if (!vistos.has(linea.proveedorId)) {
          counts[linea.proveedorId] = (counts[linea.proveedorId] ?? 0) + 1
          vistos.add(linea.proveedorId)
        }
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const topId = sorted[0]?.[0]
    if (!topId) return '—'
    return proveedores.find((p) => p.id === topId)?.nombre ?? '—'
  }

  function getPedidosPorPuesto(): Array<{ nombre: string; count: number }> {
    const counts: Record<string, number> = {}
    for (const order of pedidosSemana) {
      const vistos = new Set<string>()
      for (const linea of order.lineas) {
        if (!vistos.has(linea.proveedorId)) {
          counts[linea.proveedorId] = (counts[linea.proveedorId] ?? 0) + 1
          vistos.add(linea.proveedorId)
        }
      }
    }
    return proveedores
      .map((p) => ({ nombre: p.nombre, count: counts[p.id] ?? 0 }))
      .sort((a, b) => b.count - a.count)
  }

  function getPedidosPorFruteria(): Array<{ nombre: string; count: number }> {
    const counts: Record<string, number> = {}
    for (const order of pedidosSemana) {
      counts[order.fruteroId] = (counts[order.fruteroId] ?? 0) + 1
    }
    return fruteros
      .map((f) => ({ nombre: f.nombre, count: counts[f.id] ?? 0 }))
      .sort((a, b) => b.count - a.count)
  }

  return (
    <main
      className="flex flex-col gap-6 px-4 py-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 1.5rem)' }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-bosque font-serif">Administración</h1>
        <button
          onClick={cargar}
          disabled={loading}
          className="text-sm font-medium text-bosque disabled:text-gray-300"
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
          {/* ── Fase del negocio ──────────────────────────────────────────── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-4">
            <h2 className="text-base font-semibold text-bosque font-serif mb-4">
              Fase del negocio
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSetFase('fase0')}
                disabled={loadingFase}
                className={`flex flex-col gap-1.5 p-4 rounded-xl text-left transition-colors disabled:opacity-60 ${
                  fase === 'fase0' ? 'bg-bosque' : 'bg-fondo'
                }`}
              >
                <span
                  className={`font-semibold text-sm leading-tight ${
                    fase === 'fase0' ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  Fase 0 — Sin reparto
                </span>
                <span
                  className={`text-xs leading-snug ${
                    fase === 'fase0' ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  Pedido preparado para recoger en el puesto
                </span>
              </button>
              <button
                onClick={() => handleSetFase('fase2')}
                disabled={loadingFase}
                className={`flex flex-col gap-1.5 p-4 rounded-xl text-left transition-colors disabled:opacity-60 ${
                  fase === 'fase2' ? 'bg-bosque' : 'bg-fondo'
                }`}
              >
                <span
                  className={`font-semibold text-sm leading-tight ${
                    fase === 'fase2' ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  Fase 2 — Con reparto
                </span>
                <span
                  className={`text-xs leading-snug ${
                    fase === 'fase2' ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  Entrega a domicilio con repartidor
                </span>
              </button>
            </div>
          </section>

          {/* ── Analítica ────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-bosque font-serif">Analítica</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Pedidos hoy</p>
                <p className="text-3xl font-bold text-bosque font-serif tabular-nums">
                  {pedidos.length}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Pedidos esta semana</p>
                <p className="text-3xl font-bold text-bosque font-serif tabular-nums">
                  {pedidosSemana.length}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Producto más pedido</p>
                <p className="text-sm font-semibold text-bosque leading-tight mt-1">
                  {getProductoMasPedido()}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Puesto más solicitado</p>
                <p className="text-sm font-semibold text-bosque leading-tight mt-1">
                  {getPuestoMasSolicitado()}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-bosque">Pedidos por puesto</h3>
                <p className="text-xs text-gray-400 mt-0.5">Últimos 7 días</p>
              </div>
              {getPedidosPorPuesto().length === 0 ? (
                <p className="text-sm text-gray-400 px-4 py-3">Sin datos esta semana.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {getPedidosPorPuesto().map((row) => (
                    <div key={row.nombre} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-700">{row.nombre}</span>
                      <span className="text-sm font-semibold text-bosque tabular-nums">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-bosque">Pedidos por frutería</h3>
                <p className="text-xs text-gray-400 mt-0.5">Últimos 7 días</p>
              </div>
              {getPedidosPorFruteria().length === 0 ? (
                <p className="text-sm text-gray-400 px-4 py-3">Sin datos esta semana.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {getPedidosPorFruteria().map((row) => (
                    <div key={row.nombre} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-700">{row.nombre}</span>
                      <span className="text-sm font-semibold text-bosque tabular-nums">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Proveedores pendientes ────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-bosque font-serif mb-3 flex items-center gap-2">
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
                        className="flex-1 bg-bosque hover:bg-bosque-dark disabled:opacity-50 text-white text-sm font-medium py-2 rounded-xl transition-colors"
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

          {/* ── Estado de la ruta ────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-bosque font-serif mb-3">
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

          {/* ── Pedidos de hoy ───────────────────────────────────────────── */}
          <section>
            <h2 className="text-base font-semibold text-bosque font-serif mb-3 flex items-center gap-2">
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

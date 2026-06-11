import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ORDERS, MOCK_PRODUCTOS, MOCK_PROVEEDORES } from '@/lib/mock-data'
import { useCartStore } from '@/lib/stores/cart'
import BottomNav from '@/components/BottomNav'
import CartIcon from '@/components/CartIcon'
import type { Order, OrderStatus } from '@/lib/types'

// ─── Timeline ─────────────────────────────────────────────────────────────────

const PASOS: { estado: OrderStatus; label: string }[] = [
  { estado: 'confirmado', label: 'Confirmado' },
  { estado: 'en_recogida', label: 'En recogida' },
  { estado: 'recogido', label: 'Recogido' },
  { estado: 'en_reparto', label: 'En reparto' },
  { estado: 'entregado', label: 'Entregado' },
]

const ORDEN_ESTADOS: OrderStatus[] = [
  'confirmado', 'en_recogida', 'recogido', 'en_reparto', 'entregado',
]

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function getStepState(pasoEstado: OrderStatus, pedidoEstado: OrderStatus): 'completado' | 'activo' | 'pendiente' {
  if (pedidoEstado === 'incidencia') return 'pendiente'
  const indexPaso = ORDEN_ESTADOS.indexOf(pasoEstado)
  const indexPedido = ORDEN_ESTADOS.indexOf(pedidoEstado)
  if (indexPaso < indexPedido) return 'completado'
  if (indexPaso === indexPedido) return 'activo'
  return 'pendiente'
}

function TimelineEstado({ estado }: { estado: OrderStatus }) {
  const esIncidencia = estado === 'incidencia'
  const pasosAMostrar = esIncidencia ? PASOS.slice(0, 3) : PASOS

  return (
    <div className="flex items-start gap-0">
      {pasosAMostrar.map((paso, i) => {
        const state = esIncidencia ? 'pendiente' : getStepState(paso.estado, estado)
        const isLast = i === pasosAMostrar.length - 1

        return (
          <div key={paso.estado} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                style={{
                  backgroundColor:
                    state === 'activo' ? '#F28C28' :
                    state === 'completado' ? '#6F9E7B' :
                    '#E5E7EB',
                  color: state === 'pendiente' ? '#9CA3AF' : '#FFFFFF',
                }}
              >
                {state === 'completado' && <IconCheck />}
                {state === 'activo' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <p
                className="text-[10px] text-center mt-1 leading-tight"
                style={{
                  color:
                    state === 'activo' ? '#F28C28' :
                    state === 'completado' ? '#6F9E7B' :
                    '#9CA3AF',
                  fontWeight: state === 'activo' ? 600 : 400,
                }}
              >
                {paso.label}
              </p>
            </div>
            {!isLast && (
              <div
                className="h-px mt-3.5 shrink-0"
                style={{
                  width: '100%',
                  flex: '0 0 8px',
                  backgroundColor: state === 'completado' ? '#6F9E7B' : '#E5E7EB',
                }}
              />
            )}
          </div>
        )
      })}

      {esIncidencia && (
        <div className="flex items-start flex-1">
          <div className="h-px mt-3.5 shrink-0 flex-0 w-2" style={{ backgroundColor: '#FEE2E2' }} />
          <div className="flex flex-col items-center flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
            >
              <IconWarning />
            </div>
            <p className="text-[10px] text-center mt-1 leading-tight font-semibold" style={{ color: '#DC2626' }}>
              Incidencia
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const ESTADO_LABEL: Record<OrderStatus, string> = {
  confirmado: 'Confirmado',
  en_recogida: 'En recogida',
  recogido: 'Recogido',
  en_reparto: 'En reparto',
  entregado: 'Entregado',
  incidencia: 'Incidencia',
}

function BadgeEstado({ estado }: { estado: OrderStatus }) {
  const styles: Record<OrderStatus, { bg: string; color: string }> = {
    confirmado: { bg: '#EEF2FF', color: '#4338CA' },
    en_recogida: { bg: '#FEF3C7', color: '#92400E' },
    recogido: { bg: '#D1FAE5', color: '#065F46' },
    en_reparto: { bg: '#FEF0DC', color: '#92400E' },
    entregado: { bg: '#DCFCE7', color: '#166534' },
    incidencia: { bg: '#FEE2E2', color: '#991B1B' },
  }
  const s = styles[estado]
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-1"
      style={{ backgroundColor: s.bg, color: s.color, borderRadius: 20 }}
    >
      {ESTADO_LABEL[estado]}
    </span>
  )
}

function IconBox() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

// ─── Modal conflicto de carrito ───────────────────────────────────────────────

interface ModalConflictoProps {
  onSustituir: () => void
  onAnadir: () => void
  onCancelar: () => void
}

function ModalConflicto({ onSustituir, onAnadir, onCancelar }: ModalConflictoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onCancelar}
      />
      <div
        className="relative w-full bg-white p-6 mx-4 mb-4"
        style={{ borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxWidth: 480 }}
      >
        <h2 className="text-lg font-bold font-serif mb-1" style={{ color: '#1B3A2A' }}>
          Tu carrito tiene productos
        </h2>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          ¿Sustituir o añadir al carrito actual?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 text-sm font-medium"
            style={{ color: '#6B7280' }}
          >
            Cancelar
          </button>
          <button
            onClick={onAnadir}
            className="flex-1 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: '#1B3A2A', borderRadius: 12 }}
          >
            Añadir
          </button>
          <button
            onClick={onSustituir}
            className="flex-1 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
          >
            Sustituir
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PedidosPage() {
  const navigate = useNavigate()
  const { lineas, addLine, clear } = useCartStore()

  const [pedidoConflicto, setPedidoConflicto] = useState<Order | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const hayPedidos = MOCK_ORDERS.length > 0

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2500)
    return () => clearTimeout(t)
  }, [toastVisible])

  const cargarLineasEnCarrito = (pedido: Order) => {
    for (const linea of pedido.lineas) {
      const producto = MOCK_PRODUCTOS.find((p) => p.id === linea.productoId)
      const proveedor = MOCK_PROVEEDORES.find((p) => p.id === linea.proveedorId)
      if (producto && proveedor) {
        addLine(producto, proveedor, linea.cantidad)
      }
    }
  }

  const handleRepetir = (pedido: Order) => {
    if (lineas.length > 0) {
      setPedidoConflicto(pedido)
      return
    }
    cargarLineasEnCarrito(pedido)
    setToastVisible(true)
    setTimeout(() => navigate('/app/frutero/carrito'), 800)
  }

  const handleSustituir = () => {
    if (!pedidoConflicto) return
    clear()
    cargarLineasEnCarrito(pedidoConflicto)
    setPedidoConflicto(null)
    setToastVisible(true)
    setTimeout(() => navigate('/app/frutero/carrito'), 800)
  }

  const handleAnadir = () => {
    if (!pedidoConflicto) return
    cargarLineasEnCarrito(pedidoConflicto)
    setPedidoConflicto(null)
    setToastVisible(true)
    setTimeout(() => navigate('/app/frutero/carrito'), 800)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3', paddingBottom: '80px' }}>
      {/* Toast */}
      {toastVisible && (
        <div
          className="fixed top-4 left-1/2 z-50 px-5 py-2.5 text-white text-sm font-medium"
          style={{
            transform: 'translateX(-50%)',
            backgroundColor: '#1B3A2A',
            borderRadius: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          Pedido añadido al carrito
        </div>
      )}

      {/* Cabecera */}
      <div className="bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Mis pedidos</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              Historial y seguimiento en tiempo real
            </p>
          </div>
          <CartIcon />
        </div>
      </div>

      {hayPedidos ? (
        <div className="px-4 py-4 space-y-4">
          {MOCK_ORDERS.map((pedido) => {
            const fecha = new Date(pedido.fechaConfirmacion).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
            return (
              <div
                key={pedido.id}
                className="bg-white"
                style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}
              >
                {/* Cabecera del pedido */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between">
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{fecha}</p>
                    <p className="font-bold font-serif" style={{ color: '#222222' }}>
                      Pedido #{pedido.id.toUpperCase()}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
                      {pedido.lineas.length} {pedido.lineas.length === 1 ? 'artículo' : 'artículos'} · {pedido.total.toFixed(2)} €
                    </p>
                  </div>
                  <BadgeEstado estado={pedido.estado} />
                </div>

                {/* Timeline de estado */}
                <div className="px-4 pb-3" style={{ borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
                  <TimelineEstado estado={pedido.estado} />
                </div>

                {/* Detalle de líneas */}
                <div className="px-4 pb-3" style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF', letterSpacing: '0.1em' }}>
                    Artículos
                  </p>
                  <div className="space-y-1.5">
                    {pedido.lineas.map((linea) => (
                      <div key={linea.productoId} className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#222222' }}>
                          {linea.nombreProducto}
                          <span className="ml-1 text-xs" style={{ color: '#9CA3AF' }}>×{linea.cantidad}</span>
                        </span>
                        <span className="text-sm font-medium" style={{ color: '#222222' }}>
                          {linea.subtotal.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <span className="text-sm font-bold font-serif" style={{ color: '#222222' }}>Total</span>
                    <span className="text-base font-bold font-serif" style={{ color: '#1B3A2A' }}>{pedido.total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Botón repetir pedido */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleRepetir(pedido)}
                    className="w-full py-3 text-white text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#F28C28', borderRadius: 10 }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
                  >
                    Repetir pedido
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconBox />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            No tienes pedidos aún
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Cuando hagas tu primer pedido, aquí podrás seguir su estado en tiempo real.
          </p>
          <a
            href="/app/frutero"
            className="text-sm font-semibold px-5 py-3 text-white"
            style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
          >
            Hacer mi primer pedido
          </a>
        </div>
      )}

      <BottomNav />

      {/* Modal conflicto de carrito */}
      {pedidoConflicto && (
        <ModalConflicto
          onSustituir={handleSustituir}
          onAnadir={handleAnadir}
          onCancelar={() => setPedidoConflicto(null)}
        />
      )}
    </div>
  )
}

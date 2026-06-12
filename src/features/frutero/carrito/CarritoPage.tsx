import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'
import { useAuthStore } from '@/lib/stores/auth'
import { createOrder } from '@/lib/api'
import { sendOrderConfirmation } from '@/lib/notifications'
import { useFase } from '@/lib/hooks/useFase'
import type { SubtotalPorProveedor } from '@/lib/types'
import BottomNav from '@/components/BottomNav'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Modal de pago ────────────────────────────────────────────────────────────

interface ModalPagoProps {
  total: number
  onClose: () => void
  onSuccess: () => Promise<void>
}

function ModalPago({ total, onClose, onSuccess }: ModalPagoProps) {
  const [cargando, setCargando] = useState(false)

  const handleConfirmar = async () => {
    setCargando(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={!cargando ? onClose : undefined}
      />
      <div
        className="relative w-full bg-white p-6 mx-4 mb-4"
        style={{ borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxWidth: 480 }}
      >
        <h2 className="text-xl font-bold font-serif mb-6" style={{ color: '#1B3A2A' }}>
          Confirmar pedido
        </h2>

        <div className="text-center py-2 mb-2">
          <span className="text-5xl font-bold font-serif" style={{ color: '#1B3A2A' }}>
            {total.toFixed(2)} €
          </span>
        </div>

        <p className="text-center text-xs mb-8" style={{ color: '#6B7280' }}>
          Pago seguro procesado por Stripe
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={cargando}
            className="flex-1 py-3 text-sm font-medium"
            style={{ color: '#6B7280', backgroundColor: '#F3F4F6', borderRadius: 12 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={cargando}
            className="flex-[2] py-3 text-white font-semibold text-sm"
            style={{ backgroundColor: '#F28C28', borderRadius: 12, opacity: cargando ? 0.85 : 1 }}
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" />
                  <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Procesando...
              </span>
            ) : (
              `Confirmar y pagar ${total.toFixed(2)} €`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Pantalla de confirmación ─────────────────────────────────────────────────

interface ConfirmacionProps {
  grupos: SubtotalPorProveedor[]
  tarifa: number
  total: number
  fase: 'fase0' | 'fase2'
}

function PantallaConfirmacion({ grupos, tarifa, total, fase }: ConfirmacionProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F7F3' }}>
      <div className="px-4 pt-12 pb-8 text-center" style={{ backgroundColor: '#1B3A2A' }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#F28C28' }}
        >
          <IconCheck />
        </div>
        <h1 className="text-2xl font-bold font-serif text-white mb-2">
          {fase === 'fase0' ? '¡Pedido confirmado!' : 'Pedido confirmado'}
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {fase === 'fase0'
            ? 'Recógelo en cada puesto desde las 4AM. Lleva esta confirmación.'
            : 'Tu genero llegara antes de las 7AM'}
        </p>
      </div>

      <div className="px-4 py-4 space-y-3 flex-1">
        {grupos.map((grupo) => (
          <div
            key={grupo.proveedorId}
            className="overflow-hidden"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="px-4 py-2.5" style={{ backgroundColor: '#1B3A2A' }}>
              <p className="text-xs font-semibold text-white uppercase tracking-wide">
                {grupo.nombreProveedor}
              </p>
            </div>
            <div className="bg-white divide-y" style={{ borderColor: '#F3F4F6' }}>
              {grupo.lineas.map((l) => (
                <div key={l.productoId} className="flex justify-between px-4 py-2.5">
                  <span className="text-sm" style={{ color: '#222222' }}>
                    {l.nombreProducto} × {l.cantidad}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#222222' }}>
                    {l.subtotal.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          className="bg-white px-4 py-4 space-y-2"
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {fase === 'fase2' && (
            <>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Envio</span>
                <span className="text-sm" style={{ color: '#222222' }}>{tarifa.toFixed(2)} €</span>
              </div>
              <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold font-serif" style={{ color: '#222222' }}>
              {fase === 'fase0' ? 'Total productos' : 'Total pagado'}
            </span>
            <span className="text-xl font-bold font-serif" style={{ color: '#1B3A2A' }}>
              {(fase === 'fase0' ? total - tarifa : total).toFixed(2)} €
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/app/frutero/pedidos')}
          className="w-full py-4 text-white font-semibold text-base"
          style={{ backgroundColor: '#1B3A2A', borderRadius: 12 }}
        >
          {fase === 'fase0' ? 'Ver mis pedidos' : 'Ver seguimiento'}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

// ─── Carrito principal ────────────────────────────────────────────────────────

export default function CarritoPage() {
  const navigate = useNavigate()
  const { lineas, updateCantidad, removeLine, getSubtotalPorProveedor, getSubtotalBruto, getTarifaServicio, getTotal, clear } = useCartStore()
  const { user } = useAuthStore()
  const { fase, loading: faseLoading } = useFase()

  const [modalVisible, setModalVisible] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [resumen, setResumen] = useState<ConfirmacionProps | null>(null)
  const [cargandoFase0, setCargandoFase0] = useState(false)

  const subtotalesPorProveedor = getSubtotalPorProveedor()
  const subtotalBruto = getSubtotalBruto()
  const tarifaServicio = getTarifaServicio()
  const total = getTotal()
  const hayLineas = lineas.length > 0

  const crearPedido = async () => {
    const grupos = getSubtotalPorProveedor()
    const tarifa = getTarifaServicio()
    const totalFinal = getTotal()
    const todasLineas = grupos.flatMap((g) => g.lineas)

    const order = await createOrder({
      fruteroId: user!.id,
      estado: 'confirmado',
      lineas: todasLineas,
      tarifaServicio: tarifa,
      total: totalFinal,
      fechaEntregaEstimada: new Date(Date.now() + 86_400_000).toISOString(),
    })

    sendOrderConfirmation(user!.telefono, { id: order.id, total: totalFinal }).catch(console.error)

    return { grupos, tarifa, totalFinal }
  }

  const handlePagoExitoso = async () => {
    const { grupos, tarifa, totalFinal } = await crearPedido()
    setResumen({ grupos, tarifa, total: totalFinal, fase: 'fase2' })
    clear()
    setModalVisible(false)
    setConfirmado(true)
  }

  const handleConfirmarFase0 = async () => {
    setCargandoFase0(true)
    try {
      const { grupos, tarifa, totalFinal } = await crearPedido()
      setResumen({ grupos, tarifa, total: totalFinal, fase: 'fase0' })
      clear()
      setConfirmado(true)
    } finally {
      setCargandoFase0(false)
    }
  }

  if (confirmado && resumen) {
    return <PantallaConfirmacion {...resumen} />
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div className="bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 shrink-0"
            style={{ color: '#222222', backgroundColor: '#F0F5F1', borderRadius: 10 }}
          >
            <IconBack />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="block text-left"
            >
              <span className="text-[11px] font-semibold" style={{ color: '#1B3A2A', fontFamily: 'Fraunces, serif' }}>MercaOnline</span>
              <span className="text-[9px] block mt-0.5" style={{ color: '#9CA3AF' }}>Inicio</span>
            </button>
            <h1 className="text-xl font-bold font-serif mt-0.5" style={{ color: '#222222' }}>Tu pedido</h1>
          </div>
        </div>
      </div>

      {hayLineas ? (
        <div className="px-4 py-4 space-y-4">
          {/* Items agrupados por proveedor */}
          {subtotalesPorProveedor.map((grupo) => (
            <div key={grupo.proveedorId} className="overflow-hidden" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div className="px-4 py-3" style={{ backgroundColor: '#1B3A2A' }}>
                <p className="text-sm font-semibold text-white">{grupo.nombreProveedor}</p>
              </div>

              <div className="bg-white divide-y" style={{ borderColor: '#F3F4F6' }}>
                {grupo.lineas.map((linea) => {
                  const lineaCarrito = lineas.find((l) => l.producto.id === linea.productoId)
                  if (!lineaCarrito) return null
                  return (
                    <div key={linea.productoId} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#222222' }}>
                          {linea.nombreProducto}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                          {linea.precioUnitario.toFixed(2)} € / {lineaCarrito.producto.unidad}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCantidad(linea.productoId, lineaCarrito.cantidad - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', border: '1px solid #E5E7EB' }}
                        >
                          <IconMinus />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold" style={{ color: '#222222' }}>
                          {lineaCarrito.cantidad}
                        </span>
                        <button
                          onClick={() => updateCantidad(linea.productoId, lineaCarrito.cantidad + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: '#1B3A2A', color: '#FFFFFF' }}
                        >
                          <IconPlus />
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-sm font-semibold" style={{ color: '#222222' }}>
                          {linea.subtotal.toFixed(2)} €
                        </span>
                        <button onClick={() => removeLine(linea.productoId)} style={{ color: '#9CA3AF' }}>
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  )
                })}

                <div className="flex justify-between px-4 py-2.5" style={{ backgroundColor: '#FAFAFA' }}>
                  <span className="text-xs" style={{ color: '#6B7280' }}>Subtotal {grupo.nombreProveedor}</span>
                  <span className="text-xs font-semibold" style={{ color: '#222222' }}>{grupo.subtotal.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          ))}

          {/* Resumen del pedido */}
          <div
            className="bg-white px-4 py-4 space-y-3"
            style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Subtotal</span>
              <span className="text-sm" style={{ color: '#222222' }}>{subtotalBruto.toFixed(2)} €</span>
            </div>
            {fase !== 'fase0' && (
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Tarifa de servicio</span>
                <span className="text-sm" style={{ color: '#222222' }}>{tarifaServicio.toFixed(2)} €</span>
              </div>
            )}
            <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold font-serif" style={{ color: '#222222' }}>Total</span>
              <span className="text-xl font-bold font-serif" style={{ color: '#1B3A2A' }}>
                {(fase === 'fase0' ? subtotalBruto : total).toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Botón de acción */}
          {fase === 'fase0' ? (
            <>
              <button
                className="w-full text-white font-semibold py-4 text-base transition-colors"
                style={{ backgroundColor: '#F28C28', borderRadius: 12, opacity: cargandoFase0 || faseLoading ? 0.85 : 1 }}
                onClick={handleConfirmarFase0}
                disabled={cargandoFase0 || faseLoading}
              >
                {cargandoFase0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" />
                      <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Confirmando...
                  </span>
                ) : 'Confirmar pedido para recoger'}
              </button>
              <p className="text-center text-xs" style={{ color: '#6B7280' }}>
                Recogida en el puesto desde las 4:00
              </p>
            </>
          ) : (
            <>
              <button
                className="w-full text-white font-semibold py-4 text-base transition-colors"
                style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                onClick={() => setModalVisible(true)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Pagar y confirmar pedido
              </button>
              <p className="text-center text-xs" style={{ color: '#6B7280' }}>
                Entrega antes de las 7:00 · Sin permanencia
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconBox />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            El carrito esta vacio
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Añade productos de los puestos del mercado para hacer tu pedido de mañana.
          </p>
          <a
            href="/app/frutero"
            className="text-sm font-semibold px-5 py-3 text-white"
            style={{ backgroundColor: '#1B3A2A', borderRadius: 12 }}
          >
            Ver puestos del mercado
          </a>
        </div>
      )}

      <BottomNav />

      {modalVisible && (
        <ModalPago
          total={total}
          onClose={() => setModalVisible(false)}
          onSuccess={handlePagoExitoso}
        />
      )}
    </div>
  )
}

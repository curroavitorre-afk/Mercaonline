import { useState } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import type { StripeCardElementOptions } from '@stripe/stripe-js'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'
import { useAuthStore } from '@/lib/stores/auth'
import { createOrder } from '@/lib/api'
import { stripePromise, simulateCharge } from '@/lib/stripe'
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

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Stripe Card Element options ──────────────────────────────────────────────

const CARD_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#222222',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444', iconColor: '#EF4444' },
  },
  hidePostalCode: true,
}

// ─── Modal de pago ────────────────────────────────────────────────────────────

interface ModalPagoProps {
  total: number
  onClose: () => void
  onSuccess: () => Promise<void>
}

function ModalPago({ total, onClose, onSuccess }: ModalPagoProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePagar = async () => {
    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setCargando(true)
    setError(null)

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (pmError) {
      setError(pmError.message ?? 'Error al procesar la tarjeta')
      setCargando(false)
      return
    }

    try {
      await simulateCharge(paymentMethod!.id, Math.round(total * 100))
      await onSuccess()
    } catch {
      setError('No se pudo completar el pago. Inténtalo de nuevo.')
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div
        className="relative w-full bg-white p-6 mx-4 mb-4"
        style={{ borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxWidth: 480 }}
      >
        <h2 className="text-xl font-bold font-serif mb-1" style={{ color: '#1B3A2A' }}>
          Confirmar pago
        </h2>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Total a cobrar:{' '}
          <strong style={{ color: '#222222' }}>{total.toFixed(2)} €</strong>
        </p>

        <label
          className="block text-xs font-semibold mb-2 uppercase tracking-wide"
          style={{ color: '#6B7280' }}
        >
          Datos de la tarjeta
        </label>
        <div className="p-3 border" style={{ borderColor: '#E5E7EB', borderRadius: 8 }}>
          <CardElement options={CARD_OPTIONS} />
        </div>

        {error && (
          <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}

        <p className="mt-2 text-xs" style={{ color: '#6B7280' }}>
          Modo pruebas — usa tarjeta 4242 4242 4242 4242
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={cargando}
            className="flex-1 py-3 text-sm font-medium"
            style={{ color: '#6B7280' }}
          >
            Cancelar
          </button>
          <button
            onClick={handlePagar}
            disabled={cargando || !stripe}
            className="flex-[2] py-3 text-white font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#F28C28', borderRadius: 12, opacity: cargando || !stripe ? 0.7 : 1 }}
          >
            {cargando ? 'Procesando...' : `Pagar ${total.toFixed(2)} €`}
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
}

function PantallaConfirmacion({ grupos, tarifa, total }: ConfirmacionProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-20 flex flex-col" style={{ backgroundColor: '#F8F7F3' }}>
      <div className="px-4 pt-12 pb-8 text-center" style={{ backgroundColor: '#1B3A2A' }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#F28C28' }}
        >
          <IconCheck />
        </div>
        <h1 className="text-2xl font-bold font-serif text-white mb-2">
          Pedido confirmado
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Tu genero llegara antes de las 7AM
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
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: '#6B7280' }}>Envio</span>
            <span className="text-sm" style={{ color: '#222222' }}>{tarifa.toFixed(2)} €</span>
          </div>
          <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold font-serif" style={{ color: '#222222' }}>
              Total pagado
            </span>
            <span className="text-xl font-bold font-serif" style={{ color: '#1B3A2A' }}>
              {total.toFixed(2)} €
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/app/frutero/pedidos')}
          className="w-full py-4 text-white font-semibold text-base"
          style={{ backgroundColor: '#1B3A2A', borderRadius: 12 }}
        >
          Ver seguimiento
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

// ─── Carrito principal ────────────────────────────────────────────────────────

export default function CarritoPage() {
  const { lineas, updateCantidad, removeLine, getSubtotalPorProveedor, getSubtotalBruto, getTarifaServicio, getTotal, clear } = useCartStore()
  const { user } = useAuthStore()

  const [modalVisible, setModalVisible] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [resumen, setResumen] = useState<ConfirmacionProps | null>(null)

  const subtotalesPorProveedor = getSubtotalPorProveedor()
  const subtotalBruto = getSubtotalBruto()
  const tarifaServicio = getTarifaServicio()
  const total = getTotal()
  const hayLineas = lineas.length > 0

  const handlePagoExitoso = async () => {
    const grupos = getSubtotalPorProveedor()
    const tarifa = getTarifaServicio()
    const totalFinal = getTotal()
    const todasLineas = grupos.flatMap((g) => g.lineas)

    await createOrder({
      fruteroId: user!.id,
      estado: 'confirmado',
      lineas: todasLineas,
      tarifaServicio: tarifa,
      total: totalFinal,
      fechaEntregaEstimada: new Date(Date.now() + 86_400_000).toISOString(),
    })

    setResumen({ grupos, tarifa, total: totalFinal })
    clear()
    setModalVisible(false)
    setConfirmado(true)
  }

  if (confirmado && resumen) {
    return <PantallaConfirmacion {...resumen} />
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div className="bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <h1 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Tu pedido</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          Varios puestos — una sola entrega
        </p>
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
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Envio</span>
              <span className="text-sm" style={{ color: '#222222' }}>{tarifaServicio.toFixed(2)} €</span>
            </div>
            <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold font-serif" style={{ color: '#222222' }}>Total</span>
              <span className="text-xl font-bold font-serif" style={{ color: '#1B3A2A' }}>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Botón de pago */}
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

      {/* Modal de pago (Stripe Elements) */}
      {modalVisible && (
        <Elements stripe={stripePromise}>
          <ModalPago
            total={total}
            onClose={() => setModalVisible(false)}
            onSuccess={handlePagoExitoso}
          />
        </Elements>
      )}
    </div>
  )
}

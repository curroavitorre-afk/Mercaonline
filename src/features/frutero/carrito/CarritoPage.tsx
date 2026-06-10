import { useCartStore } from '@/lib/stores/cart'
import BottomNav from '@/components/BottomNav'

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

export default function CarritoPage() {
  const { lineas, updateCantidad, removeLine, getSubtotalPorProveedor, getSubtotalBruto, getTarifaServicio, getTotal } = useCartStore()

  const subtotalesPorProveedor = getSubtotalPorProveedor()
  const subtotalBruto = getSubtotalBruto()
  const tarifaServicio = getTarifaServicio()
  const total = getTotal()
  const hayLineas = lineas.length > 0

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
              {/* Cabecera del puesto */}
              <div className="px-4 py-3" style={{ backgroundColor: '#1B3A2A' }}>
                <p className="text-sm font-semibold text-white">{grupo.nombreProveedor}</p>
              </div>

              {/* Líneas */}
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

                      {/* Cantidad */}
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

                      {/* Subtotal + eliminar */}
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-sm font-semibold" style={{ color: '#222222' }}>
                          {linea.subtotal.toFixed(2)} €
                        </span>
                        <button
                          onClick={() => removeLine(linea.productoId)}
                          style={{ color: '#9CA3AF' }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Subtotal del puesto */}
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
              <span className="text-sm" style={{ color: '#6B7280' }}>Tarifa de servicio</span>
              <span className="text-sm" style={{ color: '#222222' }}>{tarifaServicio.toFixed(2)} €</span>
            </div>
            <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold font-serif" style={{ color: '#222222' }}>Total</span>
              <span className="text-xl font-bold font-serif" style={{ color: '#1B3A2A' }}>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Botón confirmar */}
          <button
            className="w-full text-white font-semibold py-4 text-base transition-colors"
            style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
          >
            Confirmar pedido para mañana →
          </button>
          <p className="text-center text-xs" style={{ color: '#6B7280' }}>
            Entrega antes de las 7:00 · Sin permanencia
          </p>
        </div>
      ) : (
        /* Carrito vacío */
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4" style={{ color: '#D1D5DB' }}>
            <IconBox />
          </div>
          <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
            El carrito está vacío
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
    </div>
  )
}

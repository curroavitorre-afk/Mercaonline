import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight'
import { getProveedorById, getProductos } from '@/lib/api'
import type { Producto, Proveedor } from '@/lib/types'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

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

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ProductosPuestoPage() {
  const { proveedorId } = useParams<{ proveedorId: string }>()
  const navigate = useNavigate()
  const { addLine, getTotalLineas } = useCartStore()
  const bottomNavHeight = useBottomNavHeight()

  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [toastProducto, setToastProducto] = useState<string | null>(null)

  const totalLineas = getTotalLineas()

  useEffect(() => {
    if (!proveedorId) return
    setCargando(true)
    Promise.all([getProveedorById(proveedorId), getProductos(proveedorId)])
      .then(([p, prods]) => {
        setProveedor(p)
        setProductos(prods)
        setCantidades(Object.fromEntries(prods.map((prod) => [prod.id, 1])))
      })
      .catch(() => {
        setProveedor(null)
        setProductos([])
      })
      .finally(() => setCargando(false))
  }, [proveedorId])

  useEffect(() => {
    if (!toastProducto) return
    const t = setTimeout(() => setToastProducto(null), 2000)
    return () => clearTimeout(t)
  }, [toastProducto])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7F3' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>Cargando productos...</p>
      </div>
    )
  }

  if (!proveedor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7F3' }}>
        <div className="text-center px-6">
          <p className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>Puesto no encontrado</p>
          <button
            onClick={() => navigate('/app/frutero')}
            className="text-sm font-semibold"
            style={{ color: '#F28C28' }}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  const setCantidad = (productoId: string, valor: number) => {
    setCantidades((prev) => ({ ...prev, [productoId]: Math.max(1, valor) }))
  }

  const handleAnadir = (producto: Producto) => {
    addLine(producto, proveedor, cantidades[producto.id] ?? 1)
    setToastProducto(producto.nombre)
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F8F7F3', paddingBottom: totalLineas > 0 ? bottomNavHeight + 80 : bottomNavHeight }}
    >
      {/* Toast */}
      {toastProducto && (
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
          Añadido al carrito
        </div>
      )}

      {/* Cabecera */}
      <div className="sticky top-0 z-40 bg-white px-4 pt-4 pb-4" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
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
            <h1 className="text-lg font-bold font-serif truncate mt-0.5" style={{ color: '#222222' }}>
              {proveedor.nombre}
            </h1>
            <p className="text-xs truncate" style={{ color: '#6B7280' }}>
              {proveedor.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* Foto del puesto */}
      {proveedor.imagenUrl && (
        <div className="relative overflow-hidden" style={{ height: 140 }}>
          <img
            src={proveedor.imagenUrl}
            alt={proveedor.nombre}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(27,58,42,0.55) 100%)' }}
          />
        </div>
      )}

      {/* Lista de productos */}
      <div className="px-4 py-4 space-y-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white px-4 py-4"
            style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight mb-0.5" style={{ color: '#222222' }}>
                  {producto.nombre}
                </p>
                <p className="text-base font-bold font-serif" style={{ color: '#1B3A2A' }}>
                  {producto.precio.toFixed(2)} €<span className="text-xs font-normal text-gray-400 ml-0.5">/{producto.unidad}</span>
                </p>
              </div>
              <div
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: producto.stockDisponible <= 100 ? 'rgba(242,140,40,0.12)' : '#F0F5F1',
                  color: producto.stockDisponible <= 100 ? '#F28C28' : '#1B3A2A',
                  borderRadius: 8,
                }}
              >
                {producto.stockDisponible} {producto.unidad} mañana
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de cantidad */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCantidad(producto.id, (cantidades[producto.id] ?? 1) - 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F8F7F3', color: '#1B3A2A', border: '1px solid #E5E7EB' }}
                >
                  <IconMinus />
                </button>
                <span className="w-7 text-center text-sm font-semibold" style={{ color: '#222222' }}>
                  {cantidades[producto.id] ?? 1}
                </span>
                <button
                  onClick={() => setCantidad(producto.id, (cantidades[producto.id] ?? 1) + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1B3A2A', color: '#FFFFFF' }}
                >
                  <IconPlus />
                </button>
              </div>

              {/* Precio total línea */}
              <span className="text-sm font-bold font-serif shrink-0" style={{ color: '#1B3A2A', minWidth: 54, textAlign: 'right' }}>
                {((cantidades[producto.id] ?? 1) * producto.precio).toFixed(2)} €
              </span>

              {/* Botón añadir */}
              <button
                onClick={() => handleAnadir(producto)}
                className="flex-1 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#F28C28', borderRadius: 10 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Añadir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante Ver carrito */}
      {totalLineas > 0 && (
        <div
          className="fixed left-4 right-4 z-40"
          style={{ bottom: 88 }}
        >
          <button
            onClick={() => navigate('/app/frutero/carrito')}
            className="w-full py-4 text-white font-semibold text-base"
            style={{
              backgroundColor: '#F28C28',
              borderRadius: 14,
              boxShadow: '0 4px 20px rgba(242,140,40,0.4)',
            }}
          >
            Ver carrito · {totalLineas} {totalLineas === 1 ? 'item' : 'items'}
          </button>
        </div>
      )}
    </div>
  )
}

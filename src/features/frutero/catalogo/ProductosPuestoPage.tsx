import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'
import type { Producto, Proveedor } from '@/lib/types'

// ─── Datos mock por puesto ────────────────────────────────────────────────────

interface PuestoData {
  proveedor: Proveedor
  productos: Producto[]
}

const PUESTOS_DATA: Record<string, PuestoData> = {
  '1': {
    proveedor: {
      id: 'mock-p1', userId: 'mock-u1', nombre: 'Frutas García',
      descripcion: 'Cítricos y fruta de temporada', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-1-1', proveedorId: 'mock-p1', nombre: 'Naranjas Valencia', precio: 0.85, unidad: 'kg', stockDisponible: 200, activo: true },
      { id: 'mg-1-2', proveedorId: 'mock-p1', nombre: 'Limones de Murcia', precio: 1.20, unidad: 'kg', stockDisponible: 80, activo: true },
      { id: 'mg-1-3', proveedorId: 'mock-p1', nombre: 'Mandarinas', precio: 1.10, unidad: 'kg', stockDisponible: 150, activo: true },
      { id: 'mg-1-4', proveedorId: 'mock-p1', nombre: 'Pomelo', precio: 0.95, unidad: 'kg', stockDisponible: 60, activo: true },
      { id: 'mg-1-5', proveedorId: 'mock-p1', nombre: 'Kiwi Hayward', precio: 3.50, unidad: 'kg', stockDisponible: 40, activo: true },
    ],
  },
  '2': {
    proveedor: {
      id: 'mock-p2', userId: 'mock-u2', nombre: 'Verduras López',
      descripcion: 'Verdura de hoja y tomate', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-2-1', proveedorId: 'mock-p2', nombre: 'Tomate rama', precio: 1.80, unidad: 'kg', stockDisponible: 120, activo: true },
      { id: 'mg-2-2', proveedorId: 'mock-p2', nombre: 'Lechuga iceberg', precio: 0.90, unidad: 'unidad', stockDisponible: 80, activo: true },
      { id: 'mg-2-3', proveedorId: 'mock-p2', nombre: 'Espinacas baby', precio: 2.20, unidad: 'kg', stockDisponible: 50, activo: true },
      { id: 'mg-2-4', proveedorId: 'mock-p2', nombre: 'Pimiento rojo', precio: 1.60, unidad: 'kg', stockDisponible: 90, activo: true },
      { id: 'mg-2-5', proveedorId: 'mock-p2', nombre: 'Pepino', precio: 0.70, unidad: 'kg', stockDisponible: 110, activo: true },
      { id: 'mg-2-6', proveedorId: 'mock-p2', nombre: 'Acelgas', precio: 1.40, unidad: 'manojos', stockDisponible: 40, activo: true },
    ],
  },
  '3': {
    proveedor: {
      id: 'mock-p3', userId: 'mock-u3', nombre: 'Finca El Olivo',
      descripcion: 'Melocotón, cereza y fruta de hueso', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-3-1', proveedorId: 'mock-p3', nombre: 'Melocotón de Calanda', precio: 2.80, unidad: 'kg', stockDisponible: 60, activo: true },
      { id: 'mg-3-2', proveedorId: 'mock-p3', nombre: 'Cereza del Jerte', precio: 5.50, unidad: 'kg', stockDisponible: 30, activo: true },
      { id: 'mg-3-3', proveedorId: 'mock-p3', nombre: 'Nectarina', precio: 2.20, unidad: 'kg', stockDisponible: 80, activo: true },
      { id: 'mg-3-4', proveedorId: 'mock-p3', nombre: 'Ciruela roja', precio: 2.50, unidad: 'kg', stockDisponible: 50, activo: true },
      { id: 'mg-3-5', proveedorId: 'mock-p3', nombre: 'Albaricoque', precio: 2.00, unidad: 'kg', stockDisponible: 70, activo: true },
    ],
  },
  '4': {
    proveedor: {
      id: 'mock-p4', userId: 'mock-u4', nombre: 'Hermanos Ruiz',
      descripcion: 'Plátano de Canarias y fruta tropical', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-4-1', proveedorId: 'mock-p4', nombre: 'Plátano de Canarias', precio: 1.90, unidad: 'kg', stockDisponible: 200, activo: true },
      { id: 'mg-4-2', proveedorId: 'mock-p4', nombre: 'Mango Keitt', precio: 3.20, unidad: 'kg', stockDisponible: 45, activo: true },
      { id: 'mg-4-3', proveedorId: 'mock-p4', nombre: 'Piña Golden', precio: 1.80, unidad: 'unidad', stockDisponible: 30, activo: true },
      { id: 'mg-4-4', proveedorId: 'mock-p4', nombre: 'Papaya', precio: 2.60, unidad: 'kg', stockDisponible: 25, activo: true },
      { id: 'mg-4-5', proveedorId: 'mock-p4', nombre: 'Aguacate Hass', precio: 3.80, unidad: 'kg', stockDisponible: 60, activo: true },
    ],
  },
  '5': {
    proveedor: {
      id: 'mock-p5', userId: 'mock-u5', nombre: 'La Huerta de Loja',
      descripcion: 'Producto local: pimiento, pepino, calabacín', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-5-1', proveedorId: 'mock-p5', nombre: 'Pimiento de Loja', precio: 1.40, unidad: 'kg', stockDisponible: 100, activo: true },
      { id: 'mg-5-2', proveedorId: 'mock-p5', nombre: 'Pepino largo', precio: 0.65, unidad: 'kg', stockDisponible: 90, activo: true },
      { id: 'mg-5-3', proveedorId: 'mock-p5', nombre: 'Calabacín', precio: 0.80, unidad: 'kg', stockDisponible: 120, activo: true },
      { id: 'mg-5-4', proveedorId: 'mock-p5', nombre: 'Berenjena', precio: 1.10, unidad: 'kg', stockDisponible: 80, activo: true },
      { id: 'mg-5-5', proveedorId: 'mock-p5', nombre: 'Judía verde', precio: 2.50, unidad: 'kg', stockDisponible: 50, activo: true },
    ],
  },
  '6': {
    proveedor: {
      id: 'mock-p6', userId: 'mock-u6', nombre: 'Distribuciones Nazarí',
      descripcion: 'Granada, higo y fruta autóctona', activo: true, estadoAprobacion: 'aprobado',
    },
    productos: [
      { id: 'mg-6-1', proveedorId: 'mock-p6', nombre: 'Granada Mollar', precio: 1.50, unidad: 'kg', stockDisponible: 150, activo: true },
      { id: 'mg-6-2', proveedorId: 'mock-p6', nombre: 'Higo negro', precio: 3.20, unidad: 'kg', stockDisponible: 40, activo: true },
      { id: 'mg-6-3', proveedorId: 'mock-p6', nombre: 'Caqui Rojo Brillante', precio: 2.00, unidad: 'kg', stockDisponible: 70, activo: true },
      { id: 'mg-6-4', proveedorId: 'mock-p6', nombre: 'Chirimoyo', precio: 4.50, unidad: 'kg', stockDisponible: 20, activo: true },
      { id: 'mg-6-5', proveedorId: 'mock-p6', nombre: 'Uva moscatel', precio: 2.80, unidad: 'kg', stockDisponible: 60, activo: true },
    ],
  },
}

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

  const puestoData = proveedorId ? PUESTOS_DATA[proveedorId] : undefined
  const totalLineas = getTotalLineas()

  const [cantidades, setCantidades] = useState<Record<string, number>>(() =>
    Object.fromEntries((puestoData?.productos ?? []).map((p) => [p.id, 1])),
  )
  const [toastProducto, setToastProducto] = useState<string | null>(null)

  useEffect(() => {
    if (!toastProducto) return
    const t = setTimeout(() => setToastProducto(null), 2000)
    return () => clearTimeout(t)
  }, [toastProducto])

  if (!puestoData) {
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

  const { proveedor, productos } = puestoData

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
      style={{ backgroundColor: '#F8F7F3', paddingBottom: totalLineas > 0 ? 160 : 80 }}
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
            style={{ color: '#1B3A2A', backgroundColor: '#F0F5F1', borderRadius: 10 }}
          >
            <IconBack />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold font-serif truncate" style={{ color: '#222222' }}>
              {proveedor.nombre}
            </h1>
            <p className="text-xs truncate" style={{ color: '#6B7280' }}>
              {proveedor.descripcion}
            </p>
          </div>
        </div>
      </div>

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
                style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 8 }}
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

              {/* Botón añadir */}
              <button
                onClick={() => handleAnadir(producto)}
                className="flex-1 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#F28C28', borderRadius: 10 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D97A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F28C28')}
              >
                Añadir al carrito
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

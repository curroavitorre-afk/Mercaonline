import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight'
import type { Producto, Proveedor } from '@/lib/types'

// ─── Datos mock por puesto ────────────────────────────────────────────────────

interface PuestoData {
  proveedor: Proveedor
  productos: Producto[]
}

const PUESTOS_DATA: Record<string, PuestoData> = {
  '1': {
    proveedor: {
      id: 'mock-p1', userId: 'mock-u1', nombre: 'Frutas Macías Vera',
      descripcion: 'Frutas y verduras variadas, cítricos y tropicales', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_macias_vera2.jpg',
    },
    productos: [
      { id: 'mg-1-1', proveedorId: 'mock-p1', nombre: 'Naranjas Valencia', precio: 0.45, unidad: 'kg', stockDisponible: 500, activo: true },
      { id: 'mg-1-2', proveedorId: 'mock-p1', nombre: 'Limones', precio: 0.55, unidad: 'kg', stockDisponible: 300, activo: true },
      { id: 'mg-1-3', proveedorId: 'mock-p1', nombre: 'Mandarinas', precio: 0.65, unidad: 'kg', stockDisponible: 400, activo: true },
      { id: 'mg-1-4', proveedorId: 'mock-p1', nombre: 'Aguacates', precio: 1.80, unidad: 'kg', stockDisponible: 150, activo: true },
      { id: 'mg-1-5', proveedorId: 'mock-p1', nombre: 'Mangos', precio: 1.50, unidad: 'kg', stockDisponible: 100, activo: true },
    ],
  },
  '2': {
    proveedor: {
      id: 'mock-p2', userId: 'mock-u2', nombre: 'Frutas Martín Mariscal',
      descripcion: 'Fruta de temporada nacional', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_martin_mariscal2.jpg',
    },
    productos: [
      { id: 'mg-2-1', proveedorId: 'mock-p2', nombre: 'Fresas Huelva', precio: 1.20, unidad: 'kg', stockDisponible: 200, activo: true },
      { id: 'mg-2-2', proveedorId: 'mock-p2', nombre: 'Melocotones', precio: 0.90, unidad: 'kg', stockDisponible: 300, activo: true },
      { id: 'mg-2-3', proveedorId: 'mock-p2', nombre: 'Nectarinas', precio: 0.85, unidad: 'kg', stockDisponible: 250, activo: true },
      { id: 'mg-2-4', proveedorId: 'mock-p2', nombre: 'Ciruelas', precio: 0.95, unidad: 'kg', stockDisponible: 180, activo: true },
      { id: 'mg-2-5', proveedorId: 'mock-p2', nombre: 'Cerezas', precio: 3.50, unidad: 'kg', stockDisponible: 80, activo: true },
    ],
  },
  '3': {
    proveedor: {
      id: 'mock-p3', userId: 'mock-u3', nombre: 'Hermanos Gallegos e Hijos',
      descripcion: 'Verdura de hoja y hortalizas', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/gallegos_e_hijos2.jpg',
    },
    productos: [
      { id: 'mg-3-1', proveedorId: 'mock-p3', nombre: 'Tomates rama', precio: 0.70, unidad: 'kg', stockDisponible: 600, activo: true },
      { id: 'mg-3-2', proveedorId: 'mock-p3', nombre: 'Pimientos rojos', precio: 0.65, unidad: 'kg', stockDisponible: 400, activo: true },
      { id: 'mg-3-3', proveedorId: 'mock-p3', nombre: 'Pepinos', precio: 0.40, unidad: 'kg', stockDisponible: 350, activo: true },
      { id: 'mg-3-4', proveedorId: 'mock-p3', nombre: 'Lechugas', precio: 0.45, unidad: 'unidad', stockDisponible: 300, activo: true },
      { id: 'mg-3-5', proveedorId: 'mock-p3', nombre: 'Judías verdes', precio: 1.10, unidad: 'kg', stockDisponible: 200, activo: true },
    ],
  },
  '4': {
    proveedor: {
      id: 'mock-p4', userId: 'mock-u4', nombre: 'Importpatata',
      descripcion: 'Patata, cebolla y tubérculos', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/importpatata2.jpg',
    },
    productos: [
      { id: 'mg-4-1', proveedorId: 'mock-p4', nombre: 'Patata blanca', precio: 0.35, unidad: 'kg', stockDisponible: 1000, activo: true },
      { id: 'mg-4-2', proveedorId: 'mock-p4', nombre: 'Patata nueva', precio: 0.55, unidad: 'kg', stockDisponible: 800, activo: true },
      { id: 'mg-4-3', proveedorId: 'mock-p4', nombre: 'Cebolla', precio: 0.30, unidad: 'kg', stockDisponible: 900, activo: true },
      { id: 'mg-4-4', proveedorId: 'mock-p4', nombre: 'Ajo morado', precio: 2.50, unidad: 'kg', stockDisponible: 200, activo: true },
      { id: 'mg-4-5', proveedorId: 'mock-p4', nombre: 'Boniato', precio: 0.60, unidad: 'kg', stockDisponible: 400, activo: true },
    ],
  },
  '5': {
    proveedor: {
      id: 'mock-p5', userId: 'mock-u5', nombre: 'Frutas del Pino',
      descripcion: 'Plátano de Canarias y fruta tropical importada', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_del_pino2.jpg',
    },
    productos: [
      { id: 'mg-5-1', proveedorId: 'mock-p5', nombre: 'Plátanos Canarias', precio: 0.85, unidad: 'kg', stockDisponible: 500, activo: true },
      { id: 'mg-5-2', proveedorId: 'mock-p5', nombre: 'Piñas', precio: 0.95, unidad: 'unidad', stockDisponible: 150, activo: true },
      { id: 'mg-5-3', proveedorId: 'mock-p5', nombre: 'Papayas', precio: 1.20, unidad: 'kg', stockDisponible: 100, activo: true },
      { id: 'mg-5-4', proveedorId: 'mock-p5', nombre: 'Cocos', precio: 1.50, unidad: 'unidad', stockDisponible: 80, activo: true },
      { id: 'mg-5-5', proveedorId: 'mock-p5', nombre: 'Kiwis', precio: 1.10, unidad: 'kg', stockDisponible: 200, activo: true },
    ],
  },
  '6': {
    proveedor: {
      id: 'mock-p6', userId: 'mock-u6', nombre: 'Hortifrut Granada',
      descripcion: 'Producto local Granada — verdura de la Vega', activo: true, estadoAprobacion: 'aprobado',
      imagenUrl: 'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/hortifrut_granada2.jpg',
    },
    productos: [
      { id: 'mg-6-1', proveedorId: 'mock-p6', nombre: 'Calabacín', precio: 0.45, unidad: 'kg', stockDisponible: 400, activo: true },
      { id: 'mg-6-2', proveedorId: 'mock-p6', nombre: 'Berenjena', precio: 0.55, unidad: 'kg', stockDisponible: 300, activo: true },
      { id: 'mg-6-3', proveedorId: 'mock-p6', nombre: 'Pimiento verde', precio: 0.50, unidad: 'kg', stockDisponible: 500, activo: true },
      { id: 'mg-6-4', proveedorId: 'mock-p6', nombre: 'Habas', precio: 1.80, unidad: 'kg', stockDisponible: 150, activo: true },
      { id: 'mg-6-5', proveedorId: 'mock-p6', nombre: 'Espárragos trigueros', precio: 2.20, unidad: 'kg', stockDisponible: 100, activo: true },
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
  const bottomNavHeight = useBottomNavHeight()

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

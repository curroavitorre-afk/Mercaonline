import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { MOCK_PROVEEDORES, MOCK_PRODUCTOS } from '@/lib/mock-data'
import type { Producto } from '@/lib/types'
import BottomNavProveedor from '@/components/BottomNavProveedor'

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

interface ProductoCardProps {
  producto: Producto
  onToggle: (id: string) => void
}

function ProductoCard({ producto, onToggle }: ProductoCardProps) {
  return (
    <div
      className="bg-white px-4 py-4"
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
        opacity: producto.activo ? 1 : 0.6,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: '#222222' }}>
            {producto.nombre}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span
              className="text-xs font-semibold px-2 py-0.5"
              style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 8 }}
            >
              {producto.precio.toFixed(2)} € / {producto.unidad}
            </span>
            <span className="text-xs" style={{ color: '#6B7280' }}>
              Stock: <span className="font-medium" style={{ color: '#222222' }}>{producto.stockDisponible} {producto.unidad}</span>
            </span>
          </div>
        </div>

        {/* Toggle activo/inactivo */}
        <button
          onClick={() => onToggle(producto.id)}
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
          style={{ backgroundColor: producto.activo ? '#1B3A2A' : '#D1D5DB' }}
          aria-label={producto.activo ? 'Desactivar' : 'Activar'}
        >
          <span
            className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
            style={{ transform: producto.activo ? 'translateX(24px)' : 'translateX(4px)' }}
          />
        </button>
      </div>
    </div>
  )
}

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

export default function MiCatalogoPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const miProveedor = MOCK_PROVEEDORES.find((p) => p.userId === user?.id) ?? MOCK_PROVEEDORES[0]

  const [productos, setProductos] = useState<Producto[]>(
    MOCK_PRODUCTOS.filter((p) => p.proveedorId === (miProveedor?.id ?? '')),
  )
  const [showAlbaranModal, setShowAlbaranModal] = useState(false)

  function handleToggle(id: string) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)),
    )
  }

  if (!miProveedor) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Inter, sans-serif', color:'#6B7280'}}>
        Cargando...
      </div>
    )
  }

  const esPendiente = miProveedor.estadoAprobacion === 'pendiente'
  const hayProductos = productos.length > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Cabecera */}
      <div className="px-4 pt-4 pb-5" style={{ backgroundColor: '#1B3A2A' }}>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 shrink-0"
            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 }}
          >
            <IconBack />
          </button>
          <button
            onClick={() => navigate('/app/proveedor')}
            className="text-[11px] font-bold"
            style={{ color: '#FFFFFF', fontFamily: 'Fraunces, serif', letterSpacing: '0.03em' }}
          >
            MercaOnline
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-serif text-white">{miProveedor.nombre}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {miProveedor.descripcion}
            </p>
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 shrink-0"
            style={{
              backgroundColor: miProveedor.estadoAprobacion === 'aprobado'
                ? 'rgba(111,158,123,0.3)'
                : 'rgba(251,191,36,0.2)',
              color: miProveedor.estadoAprobacion === 'aprobado' ? '#6F9E7B' : '#FCD34D',
              border: miProveedor.estadoAprobacion === 'aprobado'
                ? '1px solid rgba(111,158,123,0.4)'
                : '1px solid rgba(251,191,36,0.3)',
              borderRadius: 20,
            }}
          >
            {miProveedor.estadoAprobacion === 'aprobado' ? 'Activo' : 'Pendiente aprobación'}
          </span>
        </div>

        {/* Botones */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
          >
            <IconPlus />
            Añadir producto
          </button>
          <button
            onClick={() => setShowAlbaranModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity active:opacity-80"
            style={{ backgroundColor: '#FFFFFF', color: '#1B3A2A', border: '1.5px solid #1B3A2A', borderRadius: 12 }}
          >
            <IconCamera />
            Subir albarán
          </button>
        </div>
      </div>

      {/* Banner pendiente */}
      {esPendiente && (
        <div
          className="mx-4 mt-4 flex items-start gap-3 px-4 py-3"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12 }}
        >
          <span style={{ color: '#D97706', flexShrink: 0 }}>
            <IconInfo />
          </span>
          <p className="text-sm" style={{ color: '#92400E' }}>
            Tu solicitud está en revisión. Recibirás acceso completo en 24–48 h.
          </p>
        </div>
      )}

      {/* Lista de productos */}
      <div className="px-4 py-4">
        {hayProductos ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3 px-1" style={{ color: '#9CA3AF', letterSpacing: '0.1em' }}>
              {productos.length} producto{productos.length !== 1 ? 's' : ''} · {productos.filter((p) => p.activo).length} activo{productos.filter((p) => p.activo).length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-3">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} onToggle={handleToggle} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4" style={{ color: '#D1D5DB' }}>
              <IconPackage />
            </div>
            <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
              Sin productos todavía
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Añade tus productos para que los fruteros puedan pedirlos.
            </p>
            <button
              className="text-sm font-semibold px-5 py-3 text-white"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
            >
              Añadir primer producto
            </button>
          </div>
        )}
      </div>

      <BottomNavProveedor />

      {/* Modal albarán OCR */}
      {showAlbaranModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAlbaranModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm px-6 pt-6 pb-8"
            style={{ borderRadius: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Subir albarán</h2>
              <button
                onClick={() => setShowAlbaranModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: '#6B7280', backgroundColor: '#F0F5F1', borderRadius: 8 }}
              >
                <IconX />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Fotografía tu albarán y generaremos el stock automáticamente
            </p>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 12 }}
            >
              <IconCamera />
              Seleccionar foto
            </button>
            <p className="text-center text-xs mt-4" style={{ color: '#9CA3AF' }}>
              Próximamente disponible
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

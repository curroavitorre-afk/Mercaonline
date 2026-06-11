import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/auth'
import { MOCK_PROVEEDORES, MOCK_PRODUCTOS } from '@/lib/mock-data'
import type { Producto, Unidad } from '@/lib/types'
import BottomNavProveedor from '@/components/BottomNavProveedor'

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

// ─── ProductoCard ─────────────────────────────────────────────────────────────

interface ProductoCardProps {
  producto: Producto
  onToggle: (id: string) => void
  onEdit: (producto: Producto) => void
  onDelete: (id: string) => void
}

function ProductoCard({ producto, onToggle, onEdit, onDelete }: ProductoCardProps) {
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
          {producto.descripcion && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#9CA3AF' }}>
              {producto.descripcion}
            </p>
          )}
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(producto)}
            className="w-8 h-8 flex items-center justify-center"
            style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 8 }}
            aria-label="Editar producto"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="w-8 h-8 flex items-center justify-center"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: 8 }}
            aria-label="Eliminar producto"
          >
            <IconTrash />
          </button>
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
    </div>
  )
}

// ─── Estado inicial del formulario ────────────────────────────────────────────

type FormUnidad = 'kg' | 'unidad' | 'caja'

interface FormState {
  nombre: string
  precio: string
  stock: string
  unidad: FormUnidad
  descripcion: string
  disponible: boolean
}

const FORM_VACIO: FormState = {
  nombre: '',
  precio: '',
  stock: '',
  unidad: 'kg',
  descripcion: '',
  disponible: true,
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MiCatalogoPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const miProveedor = MOCK_PROVEEDORES.find((p) => p.userId === user?.id) ?? MOCK_PROVEEDORES[0]

  const [productos, setProductos] = useState<Producto[]>(
    MOCK_PRODUCTOS.filter((p) => p.proveedorId === (miProveedor?.id ?? '')),
  )
  const [showAlbaranModal, setShowAlbaranModal] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [form, setForm] = useState<FormState>(FORM_VACIO)
  const [formError, setFormError] = useState('')

  const [confirmEliminarId, setConfirmEliminarId] = useState<string | null>(null)

  const [toastMsg, setToastMsg] = useState<string | null>(null)
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  function handleToggle(id: string) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p)),
    )
  }

  function openAdd() {
    setForm(FORM_VACIO)
    setProductoEditar(null)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(producto: Producto) {
    const unidad: FormUnidad =
      producto.unidad === 'kg' || producto.unidad === 'unidad' || producto.unidad === 'caja'
        ? producto.unidad
        : 'kg'
    setForm({
      nombre: producto.nombre,
      precio: String(producto.precio),
      stock: String(producto.stockDisponible),
      unidad,
      descripcion: producto.descripcion ?? '',
      disponible: producto.activo,
    })
    setProductoEditar(producto)
    setFormError('')
    setShowModal(true)
  }

  function handleSubmit() {
    const nombre = form.nombre.trim()
    const precio = parseFloat(form.precio.replace(',', '.'))
    const stock = parseInt(form.stock, 10)
    if (!nombre) { setFormError('El nombre es obligatorio'); return }
    if (isNaN(precio) || precio < 0) { setFormError('Precio no valido'); return }
    if (isNaN(stock) || stock < 0) { setFormError('Stock no valido'); return }
    setFormError('')

    if (productoEditar) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoEditar.id
            ? {
                ...p,
                nombre,
                precio,
                stockDisponible: stock,
                unidad: form.unidad as Unidad,
                descripcion: form.descripcion.trim() || undefined,
                activo: form.disponible,
              }
            : p,
        ),
      )
      setToastMsg('Producto actualizado')
    } else {
      const nuevo: Producto = {
        id: 'local-' + Date.now(),
        proveedorId: miProveedor?.id ?? '',
        nombre,
        precio,
        unidad: form.unidad as Unidad,
        stockDisponible: stock,
        descripcion: form.descripcion.trim() || undefined,
        activo: form.disponible,
      }
      setProductos((prev) => [...prev, nuevo])
      setToastMsg('Producto añadido')
    }
    setShowModal(false)
  }

  function handleDelete() {
    if (!confirmEliminarId) return
    setProductos((prev) => prev.filter((p) => p.id !== confirmEliminarId))
    setConfirmEliminarId(null)
    setToastMsg('Producto eliminado')
  }

  if (!miProveedor) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#6B7280' }}>
        Cargando...
      </div>
    )
  }

  const esPendiente = miProveedor.estadoAprobacion === 'pendiente'
  const hayProductos = productos.length > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F7F3' }}>
      {/* Toast */}
      {toastMsg && (
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
          {toastMsg}
        </div>
      )}

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
            onClick={() => navigate('/')}
            className="block text-left"
          >
            <span className="text-[11px] font-bold" style={{ color: '#FFFFFF', fontFamily: 'Fraunces, serif', letterSpacing: '0.03em' }}>MercaOnline</span>
            <span className="text-[9px] block mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Inicio</span>
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
            {miProveedor.estadoAprobacion === 'aprobado' ? 'Activo' : 'Pendiente aprobacion'}
          </span>
        </div>

        {/* Botones */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={openAdd}
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
            Subir albaran
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
            Tu solicitud esta en revision. Recibiras acceso completo en 24-48 h.
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
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={(id) => setConfirmEliminarId(id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4" style={{ color: '#D1D5DB' }}>
              <IconPackage />
            </div>
            <h2 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
              Sin productos todavia
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Añade tus productos para que los fruteros puedan pedirlos.
            </p>
            <button
              onClick={openAdd}
              className="text-sm font-semibold px-5 py-3 text-white"
              style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
            >
              Añadir primer producto
            </button>
          </div>
        )}
      </div>

      <BottomNavProveedor />

      {/* Modal albaran OCR */}
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
              <h2 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>Subir albaran</h2>
              <button
                onClick={() => setShowAlbaranModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: '#6B7280', backgroundColor: '#F0F5F1', borderRadius: 8 }}
              >
                <IconX />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Fotografía tu albaran y generaremos el stock automaticamente
            </p>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              style={{ backgroundColor: '#F0F5F1', color: '#1B3A2A', borderRadius: 12 }}
            >
              <IconCamera />
              Seleccionar foto
            </button>
            <p className="text-center text-xs mt-4" style={{ color: '#9CA3AF' }}>
              Proximamente disponible
            </p>
          </div>
        </div>
      )}

      {/* Modal añadir / editar producto */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm pt-6 pb-8"
            style={{ borderRadius: 20, maxHeight: '92vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 px-6">
              <h2 className="text-xl font-bold font-serif" style={{ color: '#222222' }}>
                {productoEditar ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: '#6B7280', backgroundColor: '#F0F5F1', borderRadius: 8 }}
              >
                <IconX />
              </button>
            </div>

            <div className="px-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
                  Nombre del producto <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Naranjas Valencia"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full px-4 py-3 text-sm outline-none"
                  style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, color: '#222222', backgroundColor: '#FFFFFF' }}
                />
              </div>

              {/* Precio y unidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
                    Precio <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={form.precio}
                      onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none pr-8"
                      style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, color: '#222222', backgroundColor: '#FFFFFF' }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#9CA3AF' }}>€</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
                    Unidad
                  </label>
                  <select
                    value={form.unidad}
                    onChange={(e) => setForm((f) => ({ ...f, unidad: e.target.value as FormUnidad }))}
                    className="w-full px-3 py-3 text-sm outline-none"
                    style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, color: '#222222', backgroundColor: '#FFFFFF', appearance: 'none' }}
                  >
                    <option value="kg">kg</option>
                    <option value="unidad">unidad</option>
                    <option value="caja">caja</option>
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
                  Stock disponible mañana <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none pr-14"
                    style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, color: '#222222', backgroundColor: '#FFFFFF' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#9CA3AF' }}>{form.unidad}</span>
                </div>
              </div>

              {/* Descripcion */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>
                  Descripcion breve{' '}
                  <span className="font-normal normal-case" style={{ color: '#9CA3AF' }}>(opcional)</span>
                </label>
                <textarea
                  placeholder="Ej. Cosecha propia, calibre grande"
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 text-sm outline-none resize-none"
                  style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, color: '#222222', backgroundColor: '#FFFFFF' }}
                />
              </div>

              {/* Toggle disponible */}
              <div
                className="flex items-center justify-between py-3"
                style={{ borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#222222' }}>Disponible mañana</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>El producto aparece en el catalogo</p>
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, disponible: !f.disponible }))}
                  className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
                  style={{ backgroundColor: form.disponible ? '#1B3A2A' : '#D1D5DB' }}
                >
                  <span
                    className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                    style={{ transform: form.disponible ? 'translateX(24px)' : 'translateX(4px)' }}
                  />
                </button>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-sm text-center" style={{ color: '#DC2626' }}>{formError}</p>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-semibold"
                  style={{ backgroundColor: '#F3F4F6', color: '#6B7280', borderRadius: 12 }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: '#F28C28', borderRadius: 12 }}
                >
                  {productoEditar ? 'Guardar cambios' : 'Añadir producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmacion eliminar */}
      {confirmEliminarId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setConfirmEliminarId(null)}
        >
          <div
            className="bg-white w-full max-w-xs px-6 py-6"
            style={{ borderRadius: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-serif mb-2" style={{ color: '#222222' }}>
              Eliminar producto
            </h3>
            <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
              Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmEliminarId(null)}
                className="flex-1 py-3 text-sm font-semibold"
                style={{ backgroundColor: '#F3F4F6', color: '#6B7280', borderRadius: 12 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: '#DC2626', borderRadius: 12 }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

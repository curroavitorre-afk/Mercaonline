// ─── Roles ────────────────────────────────────────────────────────────────────

export type Role = 'frutero' | 'proveedor' | 'repartidor' | 'admin'

// ─── Usuario ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  telefono: string
  nombre: string
  role: Role
  createdAt: string // ISO 8601
}

// ─── Proveedor (puesto en la lonja) ───────────────────────────────────────────

export type EstadoAprobacion = 'pendiente' | 'aprobado' | 'rechazado'

export interface Proveedor {
  id: string
  userId: string // FK → User (el dueño del puesto)
  nombre: string
  descripcion: string
  imagenUrl?: string
  activo: boolean
  estadoAprobacion: EstadoAprobacion
  aprobadoPor?: string // FK → User (role: admin)
}

// ─── Unidades de medida ───────────────────────────────────────────────────────

export type Unidad = 'kg' | 'unidad' | 'bandeja' | 'caja' | 'manojos'

// ─── Producto ─────────────────────────────────────────────────────────────────

export interface Producto {
  id: string
  proveedorId: string // FK → Proveedor (el dueño gestiona este producto)
  nombre: string
  descripcion?: string
  precio: number // euros, precio por unidad
  unidad: Unidad
  stockDisponible: number // unidades disponibles para el próximo pedido
  imagenUrl?: string
  activo: boolean
}

// ─── Pedido ───────────────────────────────────────────────────────────────────

/**
 * Máquina de estados del pedido:
 *
 * confirmado → en_recogida → recogido → en_reparto → entregado
 *                                                  ↘ incidencia (desde cualquier estado post-confirmado)
 */
export type OrderStatus =
  | 'confirmado'
  | 'en_recogida'
  | 'recogido'
  | 'en_reparto'
  | 'entregado'
  | 'incidencia'

export interface OrderLine {
  productoId: string
  proveedorId: string // denormalizado — un Order contiene líneas de VARIOS proveedores
  nombreProducto: string // denormalizado para historial
  cantidad: number
  precioUnitario: number // precio fijado al crear el pedido (snapshot)
  subtotal: number // cantidad * precioUnitario
}

export interface Order {
  id: string
  fruteroId: string // FK → User (role: frutero)
  repartidorId?: string // FK → User (role: repartidor) — asignado al confirmar recogida
  estado: OrderStatus
  lineas: OrderLine[]
  tarifaServicio: number // euros — va a la plataforma
  total: number // sum(lineas.subtotal) + tarifaServicio
  fechaConfirmacion: string // ISO 8601
  fechaEntregaEstimada?: string // ISO 8601
  notas?: string
  // TODO: split payment — el importe de cada puesto (sum de sus OrderLines)
  // va directo al proveedor vía la pasarela; tarifaServicio va a la plataforma.
  // La pasarela divide el pago en el momento del cobro.
}

// ─── Tipos auxiliares de UI ───────────────────────────────────────────────────

/** Subtotales agrupados por proveedor dentro del carrito */
export interface SubtotalPorProveedor {
  proveedorId: string
  nombreProveedor: string
  subtotal: number
  lineas: OrderLine[]
}

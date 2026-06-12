import { supabase } from './supabase'
import type { User, Proveedor, Producto, Order, OrderLine, OrderStatus, Role, Unidad, EstadoAprobacion } from './types'

// ─── Row types (espejo del schema SQL) ───────────────────────────────────────

interface ProfileRow {
  id: string
  telefono: string
  nombre: string
  role: string
  created_at: string
}

interface ProveedorRow {
  id: string
  user_id: string
  nombre: string
  descripcion: string
  imagen_url: string | null
  activo: boolean
  estado_aprobacion: string
  aprobado_por: string | null
}

interface ProductoRow {
  id: string
  proveedor_id: string
  nombre: string
  descripcion: string | null
  precio: number
  unidad: string
  stock_disponible: number
  imagen_url: string | null
  activo: boolean
}

interface OrderLineRow {
  id: string
  order_id: string
  producto_id: string
  proveedor_id: string
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface OrderRow {
  id: string
  frutero_id: string
  repartidor_id: string | null
  estado: string
  tarifa_servicio: number
  total: number
  notas: string | null
  fecha_entrega_estimada: string | null
  created_at: string
  updated_at: string
  order_lines?: OrderLineRow[]
}

// ─── Mappers DB → dominio ─────────────────────────────────────────────────────

const toUser = (r: ProfileRow): User => ({
  id: r.id,
  telefono: r.telefono,
  nombre: r.nombre,
  role: r.role as Role,
  createdAt: r.created_at,
})

const toProveedor = (r: ProveedorRow): Proveedor => ({
  id: r.id,
  userId: r.user_id,
  nombre: r.nombre,
  descripcion: r.descripcion,
  imagenUrl: r.imagen_url ?? undefined,
  activo: r.activo,
  estadoAprobacion: r.estado_aprobacion as EstadoAprobacion,
  aprobadoPor: r.aprobado_por ?? undefined,
})

const toProducto = (r: ProductoRow): Producto => ({
  id: r.id,
  proveedorId: r.proveedor_id,
  nombre: r.nombre,
  descripcion: r.descripcion ?? undefined,
  precio: r.precio,
  unidad: r.unidad as Unidad,
  stockDisponible: r.stock_disponible,
  imagenUrl: r.imagen_url ?? undefined,
  activo: r.activo,
})

const toOrderLine = (r: OrderLineRow): OrderLine => ({
  productoId: r.producto_id,
  proveedorId: r.proveedor_id,
  nombreProducto: r.nombre_producto,
  cantidad: r.cantidad,
  precioUnitario: r.precio_unitario,
  subtotal: r.subtotal,
})

const toOrder = (r: OrderRow): Order => ({
  id: r.id,
  fruteroId: r.frutero_id,
  repartidorId: r.repartidor_id ?? undefined,
  estado: r.estado as OrderStatus,
  lineas: (r.order_lines ?? []).map(toOrderLine),
  tarifaServicio: r.tarifa_servicio,
  total: r.total,
  fechaConfirmacion: r.created_at,
  fechaEntregaEstimada: r.fecha_entrega_estimada ?? undefined,
  notas: r.notas ?? undefined,
})

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function registerUser(telefono: string, nombre: string, role: Role): Promise<User> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('telefono', telefono)
    .maybeSingle()

  if (existing) throw new Error('El teléfono ya está registrado')

  const { data, error } = await supabase
    .from('profiles')
    .insert({ telefono, nombre, role })
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Error al registrar usuario')

  const user = toUser(data as ProfileRow)

  if (role === 'proveedor') {
    await supabase.from('proveedores').insert({ user_id: user.id, nombre, descripcion: '' })
  }

  return user
}

export async function loginUser(telefono: string): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('telefono', telefono)
    .single()

  if (error || !data) throw new Error('Teléfono no registrado')
  return toUser(data as ProfileRow)
}

// ─── Proveedores ──────────────────────────────────────────────────────────────

export async function getProveedores(): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('activo', true)
    .eq('estado_aprobacion', 'aprobado')
  if (error) throw new Error(error.message)
  return (data as ProveedorRow[]).map(toProveedor)
}

export async function getProveedorById(id: string): Promise<Proveedor | null> {
  const { data, error } = await supabase.from('proveedores').select('*').eq('id', id).single()
  if (error || !data) return null
  return toProveedor(data as ProveedorRow)
}

export async function getProveedorByUserId(userId: string): Promise<Proveedor | null> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return toProveedor(data as ProveedorRow)
}

// ─── Productos ────────────────────────────────────────────────────────────────

export async function getProductos(proveedorId?: string): Promise<Producto[]> {
  let query = supabase.from('productos').select('*').eq('activo', true)
  if (proveedorId) query = query.eq('proveedor_id', proveedorId)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as ProductoRow[]).map(toProducto)
}

export async function getProductoById(id: string): Promise<Producto | null> {
  const { data, error } = await supabase.from('productos').select('*').eq('id', id).single()
  if (error || !data) return null
  return toProducto(data as ProductoRow)
}

export async function createProducto(producto: Omit<Producto, 'id' | 'activo'>): Promise<Producto> {
  const { data, error } = await supabase
    .from('productos')
    .insert({
      proveedor_id: producto.proveedorId,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? null,
      precio: producto.precio,
      unidad: producto.unidad,
      stock_disponible: producto.stockDisponible,
      imagen_url: producto.imagenUrl ?? null,
    })
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Error al crear producto')
  return toProducto(data as ProductoRow)
}

export async function updateProducto(
  id: string,
  changes: Partial<Omit<Producto, 'id' | 'proveedorId'>>,
): Promise<Producto> {
  const patch: Record<string, unknown> = {}
  if (changes.nombre !== undefined) patch.nombre = changes.nombre
  if (changes.descripcion !== undefined) patch.descripcion = changes.descripcion
  if (changes.precio !== undefined) patch.precio = changes.precio
  if (changes.unidad !== undefined) patch.unidad = changes.unidad
  if (changes.stockDisponible !== undefined) patch.stock_disponible = changes.stockDisponible
  if (changes.imagenUrl !== undefined) patch.imagen_url = changes.imagenUrl
  if (changes.activo !== undefined) patch.activo = changes.activo

  const { data, error } = await supabase
    .from('productos')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Error al actualizar producto')
  return toProducto(data as ProductoRow)
}

export async function deleteProducto(id: string): Promise<void> {
  const { error } = await supabase.from('productos').update({ activo: false }).eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────

export async function createOrder(order: Omit<Order, 'id' | 'fechaConfirmacion'>): Promise<Order> {
  const { lineas, ...rest } = order

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      frutero_id: rest.fruteroId,
      repartidor_id: rest.repartidorId ?? null,
      estado: rest.estado,
      tarifa_servicio: rest.tarifaServicio,
      total: rest.total,
      notas: rest.notas ?? null,
      fecha_entrega_estimada: rest.fechaEntregaEstimada ?? null,
    })
    .select()
    .single()

  if (orderError || !orderRow) throw new Error(orderError?.message ?? 'Error al crear el pedido')

  const { data: linesData, error: linesError } = await supabase
    .from('order_lines')
    .insert(
      lineas.map((l) => ({
        order_id: (orderRow as OrderRow).id,
        producto_id: l.productoId,
        proveedor_id: l.proveedorId,
        nombre_producto: l.nombreProducto,
        cantidad: l.cantidad,
        precio_unitario: l.precioUnitario,
        subtotal: l.subtotal,
      })),
    )
    .select()

  if (linesError) throw new Error(linesError.message)

  return toOrder({ ...(orderRow as OrderRow), order_lines: (linesData as OrderLineRow[]) ?? [] })
}

export async function getOrdersByFrutero(fruteroId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_lines(*)')
    .eq('frutero_id', fruteroId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(toOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_lines(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return toOrder(data as OrderRow)
}

export async function updateOrderStatus(id: string, estado: OrderStatus): Promise<void> {
  const { error } = await supabase.from('orders').update({ estado }).eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getProveedoresPendientes(): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('estado_aprobacion', 'pendiente')
  if (error) throw new Error(error.message)
  return (data as ProveedorRow[]).map(toProveedor)
}

export async function aprobarProveedor(id: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('proveedores')
    .update({ estado_aprobacion: 'aprobado', aprobado_por: adminId })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function rechazarProveedor(id: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('proveedores')
    .update({ estado_aprobacion: 'rechazado', aprobado_por: adminId })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getAllOrdersToday(): Promise<Order[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_lines(*)')
    .gte('created_at', hoy.toISOString())
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(toOrder)
}

export async function getAllOrdersSemana(): Promise<Order[]> {
  const inicio = new Date()
  inicio.setDate(inicio.getDate() - 7)
  inicio.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_lines(*)')
    .gte('created_at', inicio.toISOString())
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(toOrder)
}

export async function getAllProveedores(): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('activo', true)
    .order('nombre')
  if (error) throw new Error(error.message)
  return (data as ProveedorRow[]).map(toProveedor)
}

export async function getFruteros(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'frutero')
    .order('nombre')
  if (error) throw new Error(error.message)
  return (data as ProfileRow[]).map(toUser)
}

// ─── Repartidor ───────────────────────────────────────────────────────────────

export async function getOrdersDelDiaRepartidor(repartidorId: string): Promise<Order[]> {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_lines(*)')
    .eq('repartidor_id', repartidorId)
    .gte('created_at', hoy.toISOString())
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as OrderRow[]).map(toOrder)
}

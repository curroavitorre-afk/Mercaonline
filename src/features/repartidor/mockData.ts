import type { Order } from '@/lib/types'

export const IS_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const MOCK_ORDERS_HOY: Order[] = [
  {
    id: 'demo-pedido-001',
    fruteroId: 'u1',
    repartidorId: 'u3',
    estado: 'confirmado',
    lineas: [
      {
        productoId: 'prod1',
        proveedorId: 'p1',
        nombreProducto: 'Naranjas Valencia',
        cantidad: 50,
        precioUnitario: 0.8,
        subtotal: 40,
      },
      {
        productoId: 'prod2',
        proveedorId: 'p1',
        nombreProducto: 'Limones',
        cantidad: 20,
        precioUnitario: 1.2,
        subtotal: 24,
      },
    ],
    tarifaServicio: 5,
    total: 69,
    fechaConfirmacion: new Date().toISOString(),
  },
  {
    id: 'demo-pedido-002',
    fruteroId: 'u1',
    repartidorId: 'u3',
    estado: 'confirmado',
    lineas: [
      {
        productoId: 'prod3',
        proveedorId: 'p2',
        nombreProducto: 'Tomates rama',
        cantidad: 30,
        precioUnitario: 1.5,
        subtotal: 45,
      },
    ],
    tarifaServicio: 5,
    total: 50,
    fechaConfirmacion: new Date().toISOString(),
  },
  {
    id: 'demo-pedido-003',
    fruteroId: 'u1',
    repartidorId: 'u3',
    estado: 'confirmado',
    lineas: [
      {
        productoId: 'prod5',
        proveedorId: 'p3',
        nombreProducto: 'Melocotones',
        cantidad: 15,
        precioUnitario: 2.1,
        subtotal: 31.5,
      },
    ],
    tarifaServicio: 5,
    total: 36.5,
    fechaConfirmacion: new Date().toISOString(),
  },
]

export const PUESTO_INFO: Record<string, { nombre: string; pabellon: string; puesto: string }> = {
  p1: { nombre: 'Frutas García', pabellon: 'A', puesto: '12' },
  p2: { nombre: 'Verduras López', pabellon: 'B', puesto: '7' },
  p3: { nombre: 'Finca El Olivo', pabellon: 'A', puesto: '3' },
}

export const ENTREGA_INFO: Record<string, { fruteria: string; direccion: string; hora: string }> = {
  'demo-pedido-001': {
    fruteria: 'Frutería Centro',
    direccion: 'C/ Gran Vía, 14, Granada',
    hora: '06:30',
  },
  'demo-pedido-002': {
    fruteria: 'Frutería Norte',
    direccion: 'Av. de la Constitución, 88, Granada',
    hora: '07:00',
  },
  'demo-pedido-003': {
    fruteria: 'Frutería Sur',
    direccion: 'C/ Pedro Antonio de Alarcón, 5, Granada',
    hora: '07:30',
  },
}

export const PRODUCTO_UNIDAD: Record<string, string> = {
  'Naranjas Valencia': 'kg',
  Limones: 'kg',
  'Tomates rama': 'kg',
  'Lechuga romana': 'ud.',
  Melocotones: 'kg',
}

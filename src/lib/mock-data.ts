import type { User, Proveedor, Producto, Order } from './types'

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    telefono: '600000001',
    nombre: 'Ana Frutería',
    role: 'frutero',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    telefono: '600000002',
    nombre: 'Juan Mercado',
    role: 'proveedor',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u3',
    telefono: '600000003',
    nombre: 'Pedro Reparto',
    role: 'repartidor',
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_PROVEEDORES: Proveedor[] = [
  {
    id: 'p1',
    userId: 'u2',
    nombre: 'Frutas García',
    descripcion: 'Cítricos y tropicales de temporada',
    activo: true,
  },
  {
    id: 'p2',
    userId: 'u2',
    nombre: 'Verduras Hermanos López',
    descripcion: 'Hortalizas frescas de Almería',
    activo: true,
  },
  {
    id: 'p3',
    userId: 'u2',
    nombre: 'Finca El Olivo',
    descripcion: 'Fruta de hueso y pepita de Granada',
    activo: true,
  },
]

export const MOCK_PRODUCTOS: Producto[] = [
  {
    id: 'prod1',
    proveedorId: 'p1',
    nombre: 'Naranjas Valencia',
    precio: 0.8,
    unidad: 'kg',
    stockDisponible: 200,
    activo: true,
  },
  {
    id: 'prod2',
    proveedorId: 'p1',
    nombre: 'Limones',
    precio: 1.2,
    unidad: 'kg',
    stockDisponible: 100,
    activo: true,
  },
  {
    id: 'prod3',
    proveedorId: 'p2',
    nombre: 'Tomates rama',
    precio: 1.5,
    unidad: 'kg',
    stockDisponible: 150,
    activo: true,
  },
  {
    id: 'prod4',
    proveedorId: 'p2',
    nombre: 'Lechuga romana',
    precio: 0.9,
    unidad: 'unidad',
    stockDisponible: 80,
    activo: true,
  },
  {
    id: 'prod5',
    proveedorId: 'p3',
    nombre: 'Melocotones',
    precio: 2.1,
    unidad: 'kg',
    stockDisponible: 60,
    activo: true,
  },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    fruteroId: 'u1',
    estado: 'entregado',
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
        productoId: 'prod3',
        proveedorId: 'p2',
        nombreProducto: 'Tomates rama',
        cantidad: 20,
        precioUnitario: 1.5,
        subtotal: 30,
      },
    ],
    tarifaServicio: 5,
    total: 75,
    fechaConfirmacion: '2024-06-01T22:00:00Z',
    fechaEntregaEstimada: '2024-06-02T06:00:00Z',
  },
]

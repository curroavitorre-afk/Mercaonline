import type { User } from './types'

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

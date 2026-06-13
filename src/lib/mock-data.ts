import type { User } from './types'

export const MOCK_USERS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    telefono: '600000001',
    nombre: 'Ana Frutería',
    role: 'frutero',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    telefono: '600000002',
    nombre: 'Juan Mercado',
    role: 'proveedor',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    telefono: '600000003',
    nombre: 'Pedro Reparto',
    role: 'repartidor',
    createdAt: '2024-01-01T00:00:00Z',
  },
]

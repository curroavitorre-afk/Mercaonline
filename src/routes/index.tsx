import { createBrowserRouter, Navigate } from 'react-router-dom'

import LandingPage from '@/features/landing/LandingPage'
import LoginPage from '@/features/auth/LoginPage'
import RegistroPage from '@/features/auth/RegistroPage'
import CatalogoPage from '@/features/frutero/catalogo/CatalogoPage'
import CarritoPage from '@/features/frutero/carrito/CarritoPage'
import PedidosPage from '@/features/frutero/pedidos/PedidosPage'
import MiCatalogoPage from '@/features/proveedor/catalogo/MiCatalogoPage'
import AdminPage from '@/features/admin/AdminPage'
import ProtectedRoute from '@/components/ProtectedRoute'

export const router = createBrowserRouter([
  // ─── Pública ──────────────────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/registro',
    element: <RegistroPage />,
  },

  // ─── Frutero (protegida) ──────────────────────────────────────────────────
  {
    path: '/app/frutero',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <CatalogoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/frutero/carrito',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <CarritoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/frutero/pedidos',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <PedidosPage />
      </ProtectedRoute>
    ),
  },

  // ─── Proveedor (protegida) ────────────────────────────────────────────────
  {
    path: '/app/proveedor',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <MiCatalogoPage />
      </ProtectedRoute>
    ),
  },

  // ─── Admin (protegida, placeholder) ──────────────────────────────────────
  {
    path: '/app/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },

  // ─── Redireccion catch-all ────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

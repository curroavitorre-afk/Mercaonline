import { createBrowserRouter, Navigate } from 'react-router-dom'

import LandingPage from '@/features/landing/LandingPage'
import LoginPage from '@/features/auth/LoginPage'
import RegistroPage from '@/features/auth/RegistroPage'
import CatalogoPage from '@/features/frutero/catalogo/CatalogoPage'
import ProductosPuestoPage from '@/features/frutero/catalogo/ProductosPuestoPage'
import CarritoPage from '@/features/frutero/carrito/CarritoPage'
import PedidosPage from '@/features/frutero/pedidos/PedidosPage'
import ChatPage from '@/features/frutero/chat/ChatPage'
import PerfilPage from '@/features/frutero/perfil/PerfilPage'
import ProveedorDashboardPage from '@/features/proveedor/ProveedorDashboardPage'
import MiCatalogoPage from '@/features/proveedor/catalogo/MiCatalogoPage'
import PedidosProveedorPage from '@/features/proveedor/pedidos/PedidosProveedorPage'
import PerfilProveedorPage from '@/features/proveedor/perfil/PerfilProveedorPage'
import ChatProveedorPage from '@/features/proveedor/chat/ChatProveedorPage'
import AdminPage from '@/features/admin/AdminPage'
import AdminLoginPage from '@/features/admin/AdminLoginPage'
import RutaPage from '@/features/repartidor/RutaPage'
import EstadoPage from '@/features/repartidor/EstadoPage'
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
    path: '/app/frutero/catalogo/:proveedorId',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <ProductosPuestoPage />
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
  {
    path: '/app/frutero/chat',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/frutero/perfil',
    element: (
      <ProtectedRoute roles={['frutero']}>
        <PerfilPage />
      </ProtectedRoute>
    ),
  },

  // ─── Proveedor (protegida) ────────────────────────────────────────────────
  {
    path: '/app/proveedor',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <ProveedorDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/proveedor/catalogo',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <MiCatalogoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/proveedor/pedidos',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <PedidosProveedorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/proveedor/chat',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <ChatProveedorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/proveedor/perfil',
    element: (
      <ProtectedRoute roles={['proveedor']}>
        <PerfilProveedorPage />
      </ProtectedRoute>
    ),
  },

  // ─── Admin ───────────────────────────────────────────────────────────────
  {
    path: '/admin-acceso',
    element: <AdminLoginPage />,
  },
  {
    path: '/app/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },

  // ─── Repartidor (protegida) ───────────────────────────────────────────────
  {
    path: '/app/repartidor',
    element: (
      <ProtectedRoute roles={['repartidor']}>
        <RutaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/repartidor/estado',
    element: (
      <ProtectedRoute roles={['repartidor']}>
        <EstadoPage />
      </ProtectedRoute>
    ),
  },

  // ─── Redireccion catch-all ────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

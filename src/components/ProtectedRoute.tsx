import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Role } from '@/lib/types'
import { useAuthStore } from '@/lib/stores/auth'

interface Props {
  children: ReactNode
  roles?: Role[] // si se especifica, solo esos roles pueden acceder
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    // Redirigir al home del rol correspondiente
    const roleHome: Record<Role, string> = {
      frutero: '/app/frutero',
      proveedor: '/app/proveedor',
      repartidor: '/app/repartidor',
      admin: '/app/admin',
    }
    return <Navigate to={roleHome[user.role]} replace />
  }

  return <>{children}</>
}

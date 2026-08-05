import { Navigate, Outlet } from 'react-router'

import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="route-loader">
        <div className="route-loader__spinner" />

        <p>Preparing your space...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    const correctDashboard =
      profile.role === 'admin' ? '/admin' : '/tenant'

    return <Navigate to={correctDashboard} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
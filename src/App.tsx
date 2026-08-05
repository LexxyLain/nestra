import { Route, Routes } from 'react-router'

import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import NotFoundPage from './pages/public/NotFoundPage'
import RegisterPage from './pages/public/RegisterPage'
import TenantDashboardPage from './pages/tenant/TenantDashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'
import ApplicationPage from './pages/tenant/ApplicationPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
  <Route element={<DashboardLayout />}>
    <Route path="/tenant" element={<TenantDashboardPage />} />

    <Route
      path="/tenant/application"
      element={<ApplicationPage />}
    />
  </Route>
</Route>

      

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
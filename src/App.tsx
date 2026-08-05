import { Route, Routes } from 'react-router'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import NotFoundPage from './pages/public/NotFoundPage'
import RegisterPage from './pages/public/RegisterPage'
import TenantDashboardPage from './pages/tenant/TenantDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/tenant" element={<TenantDashboardPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
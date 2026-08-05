import { Route, Routes } from 'react-router'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import HomePage from './pages/public/HomePage'
import NotFoundPage from './pages/public/NotFoundPage'
import TenantDashboardPage from './pages/tenant/TenantDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/tenant" element={<TenantDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
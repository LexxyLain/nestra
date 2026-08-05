import { Link } from 'react-router'

function AdminDashboardPage() {
  return (
    <main className="page-placeholder">
      <div className="page-placeholder__content">
        <span className="page-placeholder__eyebrow">
          Administrator Portal
        </span>

        <h1>Admin dashboard</h1>

        <p>
          This area will contain room management, tenant applications,
          leases, payments, maintenance, announcements, and visitors.
        </p>

        <Link to="/" className="button button--secondary">
          Return home
        </Link>
      </div>
    </main>
  )
}

export default AdminDashboardPage
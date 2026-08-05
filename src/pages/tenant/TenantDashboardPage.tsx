import { Link } from 'react-router'

function TenantDashboardPage() {
  return (
    <main className="page-placeholder">
      <div className="page-placeholder__content">
        <span className="page-placeholder__eyebrow">
          Tenant Portal
        </span>

        <h1>Tenant dashboard</h1>

        <p>
          This area will help tenants manage their application, accommodation,
          lease, payments, maintenance requests, announcements, and visitors.
        </p>

        <Link to="/" className="button button--secondary">
          Return home
        </Link>
      </div>
    </main>
  )
}

export default TenantDashboardPage
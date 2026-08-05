import { Link } from 'react-router'
import nestraLogo from '../../assets/branding/nestra-logo.svg'

function HomePage() {
  return (
    <main className="page-placeholder">
      <img
        src={nestraLogo}
        alt="Nestra"
        className="page-placeholder__logo"
      />

      <div className="page-placeholder__content">
        <span className="page-placeholder__eyebrow">
          Dormitory Management
        </span>

        <h1>A better way to manage dormitory living.</h1>

        <p>
          Nestra brings room assignments, rent tracking, maintenance,
          announcements, and visitor management into one welcoming platform.
        </p>

        <div className="page-placeholder__actions">
          <Link to="/tenant" className="button button--primary">
            View tenant portal
          </Link>

          <Link to="/admin" className="button button--secondary">
            View admin portal
          </Link>
        </div>
      </div>
    </main>
  )
}

export default HomePage
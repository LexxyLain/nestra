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
  <Link to="/login" className="button button--primary">
    Sign in to Nestra
  </Link>

  <a href="#about" className="button button--secondary">
    Learn more
  </a>
</div>
      </div>
    </main>
  )
}

export default HomePage
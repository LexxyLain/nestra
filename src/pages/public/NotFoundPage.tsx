import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <main className="page-placeholder">
      <div className="page-placeholder__content">
        <span className="page-placeholder__eyebrow">
          Error 404
        </span>

        <h1>We couldn’t find that page.</h1>

        <p>
          The page may have been moved, deleted, or the address may be
          incorrect.
        </p>

        <Link to="/" className="button button--primary">
          Return home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
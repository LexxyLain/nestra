import {
  BedDouble,
  ClipboardClock,
  UserRoundCheck,
  Users,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

const statistics = [
  {
    label: 'Active tenants',
    value: '0',
    detail: 'No tenants assigned yet',
    icon: Users,
    tone: 'terracotta',
  },
  {
    label: 'Available beds',
    value: '0',
    detail: 'Add rooms and beds to begin',
    icon: BedDouble,
    tone: 'sage',
  },
  {
    label: 'Pending applications',
    value: '0',
    detail: 'No applications awaiting review',
    icon: ClipboardClock,
    tone: 'gold',
  },
  {
    label: 'Expected visitors',
    value: '0',
    detail: 'No visitors expected today',
    icon: UserRoundCheck,
    tone: 'blue',
  },
]

function AdminDashboardPage() {
  const { profile } = useAuth()

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-welcome__eyebrow">
            Good to see you
          </span>

          <h2>
            Welcome back, {profile?.first_name ?? 'Administrator'}.
          </h2>

          <p>
            Here’s an overview of your dormitory. Your statistics will update
            as tenants, rooms, and applications are added.
          </p>
        </div>

        <div className="dashboard-welcome__date">
          <span>Today</span>
          <strong>
            {new Intl.DateTimeFormat('en-PH', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date())}
          </strong>
        </div>
      </section>

      <section
        className="dashboard-stats"
        aria-label="Dormitory statistics"
      >
        {statistics.map((statistic) => {
          const Icon = statistic.icon

          return (
            <article
              className="stat-card"
              key={statistic.label}
            >
              <div
                className={`stat-card__icon stat-card__icon--${statistic.tone}`}
              >
                <Icon size={21} aria-hidden="true" />
              </div>

              <span>{statistic.label}</span>
              <strong>{statistic.value}</strong>
              <small>{statistic.detail}</small>
            </article>
          )
        })}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__heading">
            <div>
              <span>Getting started</span>
              <h3>Set up your dormitory</h3>
            </div>

            <span className="status-badge status-badge--warning">
              0% complete
            </span>
          </div>

          <div className="setup-list">
            <div className="setup-list__item">
              <span>1</span>

              <div>
                <strong>Add your first room</strong>
                <p>Create a room and specify its capacity and monthly rate.</p>
              </div>
            </div>

            <div className="setup-list__item">
              <span>2</span>

              <div>
                <strong>Add beds to the room</strong>
                <p>Track each available or occupied sleeping space.</p>
              </div>
            </div>

            <div className="setup-list__item">
              <span>3</span>

              <div>
                <strong>Review tenant applications</strong>
                <p>Approve applicants and assign them to available beds.</p>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <div>
              <span>Recent activity</span>
              <h3>Nothing here yet</h3>
            </div>
          </div>

          <div className="dashboard-empty">
            <ClipboardClock size={28} aria-hidden="true" />

            <p>
              New applications, payments, and requests will appear here.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

export default AdminDashboardPage
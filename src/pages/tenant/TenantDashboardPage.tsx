import {
  ClipboardList,
  CreditCard,
  Home,
  Megaphone,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router'

const tenantCards = [
  {
    label: 'Application status',
    value: 'Not submitted',
    detail: 'Complete your application to continue',
    icon: ClipboardList,
    tone: 'terracotta',
  },
  {
    label: 'Accommodation',
    value: 'Not assigned',
    detail: 'Room details will appear after approval',
    icon: Home,
    tone: 'sage',
  },
  {
    label: 'Current balance',
    value: '₱0.00',
    detail: 'No rent charges have been created',
    icon: CreditCard,
    tone: 'gold',
  },
  {
    label: 'Announcements',
    value: '0',
    detail: 'No new announcements',
    icon: Megaphone,
    tone: 'blue',
  },
]

function TenantDashboardPage() {
  const { profile } = useAuth()

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-welcome__eyebrow">
            Welcome to Nestra
          </span>

          <h2>Hi, {profile?.first_name ?? 'there'}.</h2>

          <p>
            This is your personal space for applications, accommodation,
            payments, requests, and dormitory updates.
          </p>
        </div>

        <span className="status-badge status-badge--neutral">
          {profile?.account_status ?? 'Applicant'}
        </span>
      </section>

      <section
        className="dashboard-stats"
        aria-label="Tenant account summary"
      >
        {tenantCards.map((card) => {
          const Icon = card.icon

          return (
            <article className="stat-card" key={card.label}>
              <div
                className={`stat-card__icon stat-card__icon--${card.tone}`}
              >
                <Icon size={21} aria-hidden="true" />
              </div>

              <span>{card.label}</span>
              <strong className="stat-card__text-value">
                {card.value}
              </strong>
              <small>{card.detail}</small>
            </article>
          )
        })}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__heading">
            <div>
              <span>Your next step</span>
              <h3>Complete your accommodation application</h3>
            </div>

            <span className="status-badge status-badge--warning">
              Required
            </span>
          </div>

          <p className="dashboard-card__description">
            Tell the dormitory administrator about yourself, your emergency
            contact, and your preferred move-in date.
          </p>

          <Link
  to="/tenant/application"
  className="button button--primary"
>
  Complete application
</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <div>
              <span>Recent announcements</span>
              <h3>No announcements</h3>
            </div>
          </div>

          <div className="dashboard-empty">
            <Megaphone size={28} aria-hidden="true" />

            <p>
              Dormitory news and important notices will appear here.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

export default TenantDashboardPage
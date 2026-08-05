import { useState, type ComponentType } from 'react'
import {
  Bell,
  ClipboardList,
  CreditCard,
  DoorOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  UserCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router'

import nestraLogo from '../assets/branding/nestra-logo.svg'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth'
import '../styles/dashboard.css'

interface NavigationItem {
  label: string
  path: string
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  available: boolean
}

const adminNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    available: true,
  },
  {
    label: 'Applications',
    path: '/admin/applications',
    icon: ClipboardList,
    available: false,
  },
  {
    label: 'Tenants',
    path: '/admin/tenants',
    icon: Users,
    available: false,
  },
  {
    label: 'Rooms & beds',
    path: '/admin/rooms',
    icon: DoorOpen,
    available: false,
  },
  {
    label: 'Leases',
    path: '/admin/leases',
    icon: FileText,
    available: false,
  },
  {
    label: 'Payments',
    path: '/admin/payments',
    icon: CreditCard,
    available: false,
  },
  {
    label: 'Maintenance',
    path: '/admin/maintenance',
    icon: Wrench,
    available: false,
  },
  {
    label: 'Announcements',
    path: '/admin/announcements',
    icon: Megaphone,
    available: false,
  },
  {
    label: 'Visitors',
    path: '/admin/visitors',
    icon: UserCheck,
    available: false,
  },
]

const tenantNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/tenant',
    icon: LayoutDashboard,
    available: true,
  },
  {
  label: 'My application',
  path: '/tenant/application',
  icon: ClipboardList,
  available: true,
},
  {
    label: 'My accommodation',
    path: '/tenant/accommodation',
    icon: DoorOpen,
    available: false,
  },
  {
    label: 'My lease',
    path: '/tenant/lease',
    icon: FileText,
    available: false,
  },
  {
    label: 'Payments',
    path: '/tenant/payments',
    icon: CreditCard,
    available: false,
  },
  {
    label: 'Maintenance',
    path: '/tenant/maintenance',
    icon: Wrench,
    available: false,
  },
  {
    label: 'Announcements',
    path: '/tenant/announcements',
    icon: Megaphone,
    available: false,
  },
  {
    label: 'Visitors',
    path: '/tenant/visitors',
    icon: UserCheck,
    available: false,
  },
]

function getDashboardTitle(role: UserRole) {
  return role === 'admin' ? 'Admin dashboard' : 'Your dashboard'
}

function DashboardLayout() {
  const navigate = useNavigate()

  const { profile, signOut } = useAuth()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const role = profile?.role ?? 'tenant'

  const navigation =
    role === 'admin' ? adminNavigation : tenantNavigation

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : 'Nestra user'

  const initials = profile
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
        .toUpperCase()
    : 'NU'

  async function handleSignOut() {
    try {
      setIsSigningOut(true)
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Unable to sign out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="dashboard-shell">
      {isSidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          isSidebarOpen ? 'dashboard-sidebar--open' : ''
        }`}
      >
        <div className="dashboard-sidebar__header">
          <NavLink
  to={role === 'admin' ? '/admin' : '/tenant'}
  className="dashboard-sidebar__brand"
  aria-label="Go to dashboard"
  onClick={() => setIsSidebarOpen(false)}
>
            <img src={nestraLogo} alt="Nestra" />
          </NavLink>

          <button
            type="button"
            className="dashboard-icon-button dashboard-sidebar__close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        <div className="dashboard-sidebar__role">
          <span>{role === 'admin' ? 'Management portal' : 'Resident portal'}</span>
        </div>

        <nav
          className="dashboard-navigation"
          aria-label={`${role} navigation`}
        >
          {navigation.map((item) => {
            const Icon = item.icon

            if (!item.available) {
              return (
                <span
                  key={item.path}
                  className="dashboard-navigation__link dashboard-navigation__link--disabled"
                  aria-disabled="true"
                  title="This module is coming next"
                >
                  <Icon size={19} aria-hidden={true} />

                  <span>{item.label}</span>

                  <small>Soon</small>
                </span>
              )
            }

            return (
              <NavLink
  key={item.path}
  to={item.path}
  end
  onClick={() => setIsSidebarOpen(false)}
  className={({ isActive }) =>
    `dashboard-navigation__link ${
      isActive
        ? 'dashboard-navigation__link--active'
        : ''
    }`
  }
>
                <Icon size={19} aria-hidden={true} />

                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="dashboard-sidebar__footer">
          <div className="dashboard-user">
            <div className="dashboard-user__avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="dashboard-user__details">
              <strong>{fullName}</strong>
              <span>{role === 'admin' ? 'Administrator' : 'Tenant'}</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-signout"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut size={18} aria-hidden="true" />

            <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header__start">
            <button
              type="button"
              className="dashboard-icon-button dashboard-menu-button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} aria-hidden="true" />
            </button>

            <div>
              <span className="dashboard-header__eyebrow">
                {role === 'admin'
                  ? 'Dormitory management'
                  : 'Nestra resident portal'}
              </span>

              <h1>{getDashboardTitle(role)}</h1>
            </div>
          </div>

          <div className="dashboard-header__actions">
            <button
              type="button"
              className="dashboard-icon-button dashboard-notification"
              aria-label="View notifications"
            >
              <Bell size={20} aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

            <div className="dashboard-header__profile">
              <div className="dashboard-user__avatar" aria-hidden="true">
                {initials}
              </div>

              <div>
                <strong>{fullName}</strong>
                <span>
                  {role === 'admin' ? 'Administrator' : 'Tenant'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
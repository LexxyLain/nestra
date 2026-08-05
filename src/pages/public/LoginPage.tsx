import { useState, type FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import nestraLogo from '../../assets/branding/nestra-logo.svg'
import { supabase } from '../../services/supabase'
import '../../styles/auth.css'

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormError('')
    setIsSubmitting(true)

    const form = new FormData(event.currentTarget)

    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (loginError) {
        throw loginError
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, account_status')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()

        throw new Error(
          'Your account profile could not be loaded. Please contact the administrator.',
        )
      }

      if (profile.role === 'admin') {
        navigate('/admin', { replace: true })
        return
      }

      navigate('/tenant', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not sign you in. Please try again.'

      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="auth-brand" aria-label="Return to homepage">
          <img src={nestraLogo} alt="Nestra" />
        </Link>

        <div className="auth-form-wrapper">
          <div className="auth-heading">
            <span className="auth-eyebrow">Welcome home</span>

            <h1>Sign in to Nestra</h1>

            <p>
              Access your accommodation, payments, requests, and dormitory
              updates in one place.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <Mail size={19} aria-hidden="true" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="text-button"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={19} aria-hidden="true" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer-text">
            Looking for a place to stay?{' '}
            <Link to="/register" className="text-button">
              Create an account
            </Link>
          </p>
        </div>

        <p className="auth-copyright">
          © {new Date().getFullYear()} Nestra. Comfortable living, thoughtfully
          managed.
        </p>
      </section>

      <aside className="auth-visual" aria-label="Nestra introduction">
        <div className="auth-visual__glow auth-visual__glow--one" />
        <div className="auth-visual__glow auth-visual__glow--two" />

        <div className="auth-visual__content">
          <span className="auth-visual__badge">
            Everything in one place
          </span>

          <blockquote>
            “A calmer way to manage the place you call home.”
          </blockquote>

          <p>
            From monthly rent to maintenance requests, Nestra keeps dormitory
            living organized and easy to understand.
          </p>
        </div>

        <div className="auth-nest" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </aside>
    </main>
  )
}

export default LoginPage
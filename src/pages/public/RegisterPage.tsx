import { useState, type FormEvent } from 'react'
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router'

import nestraLogo from '../../assets/branding/nestra-logo.svg'
import { supabase } from '../../services/supabase'
import '../../styles/auth.css'

type ApplicantType = 'student' | 'professional'

function RegisterPage() {
  const [applicantType, setApplicantType] =
    useState<ApplicantType>('student')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormError('')
    setSuccessMessage('')

    const form = new FormData(event.currentTarget)

    const firstName = String(form.get('firstName')).trim()
    const lastName = String(form.get('lastName')).trim()
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))
    const confirmPassword = String(form.get('confirmPassword'))

    if (password !== confirmPassword) {
      setFormError('The passwords you entered do not match.')
      return
    }

    if (password.length < 8) {
      setFormError('Your password must contain at least eight characters.')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            applicant_type: applicantType,
          },
        },
      })

      if (error) {
        throw error
      }

      setSuccessMessage(
        'Your account was created. Check your email to confirm your account before signing in.',
      )

      event.currentTarget.reset()
      setApplicantType('student')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not create your account. Please try again.'

      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel--register">
        <Link to="/" className="auth-brand" aria-label="Return to homepage">
          <img src={nestraLogo} alt="Nestra" />
        </Link>

        <div className="auth-form-wrapper auth-form-wrapper--wide">
          <div className="auth-heading">
            <span className="auth-eyebrow">Join our community</span>

            <h1>Create your account</h1>

            <p>
              Start your accommodation application and find a space that feels
              like home.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <fieldset className="account-type" disabled={isSubmitting}>
              <legend>I am applying as a</legend>

              <div className="account-type__options">
                <label
                  className={`account-type__card ${
                    applicantType === 'student'
                      ? 'account-type__card--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="applicantType"
                    value="student"
                    checked={applicantType === 'student'}
                    onChange={() => setApplicantType('student')}
                  />

                  <GraduationCap size={22} aria-hidden="true" />

                  <span>
                    <strong>Student</strong>
                    <small>Currently enrolled in school</small>
                  </span>
                </label>

                <label
                  className={`account-type__card ${
                    applicantType === 'professional'
                      ? 'account-type__card--active'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="applicantType"
                    value="professional"
                    checked={applicantType === 'professional'}
                    onChange={() => setApplicantType('professional')}
                  />

                  <BriefcaseBusiness size={22} aria-hidden="true" />

                  <span>
                    <strong>Professional</strong>
                    <small>Currently employed or self-employed</small>
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">First name</label>

                <div className="input-wrapper">
                  <UserRound size={19} aria-hidden="true" />

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last name</label>

                <div className="input-wrapper">
                  <UserRound size={19} aria-hidden="true" />

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="registerEmail">Email address</label>

              <div className="input-wrapper">
                <Mail size={19} aria-hidden="true" />

                <input
                  id="registerEmail"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="registerPassword">Password</label>

                <div className="input-wrapper">
                  <LockKeyhole size={19} aria-hidden="true" />

                  <input
                    id="registerPassword"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
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

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm password</label>

                <div className="input-wrapper">
                  <LockKeyhole size={19} aria-hidden="true" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmation ? 'text' : 'password'}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    minLength={8}
                    disabled={isSubmitting}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmation((current) => !current)
                    }
                    aria-label={
                      showConfirmation
                        ? 'Hide password confirmation'
                        : 'Show password confirmation'
                    }
                    disabled={isSubmitting}
                  >
                    {showConfirmation ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}

            {successMessage && (
              <p className="form-success" role="status">
                {successMessage}
              </p>
            )}

            <label className="checkbox-field checkbox-field--terms">
              <input
                type="checkbox"
                name="terms"
                disabled={isSubmitting}
                required
              />

              <span>
                I agree to Nestra’s terms of use and acknowledge the privacy
                notice.
              </span>
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="text-button">
              Sign in
            </Link>
          </p>
        </div>

        <p className="auth-copyright">
          © {new Date().getFullYear()} Nestra. Comfortable living, thoughtfully
          managed.
        </p>
      </section>

      <aside className="auth-visual" aria-label="Nestra registration">
        <div className="auth-visual__glow auth-visual__glow--one" />
        <div className="auth-visual__glow auth-visual__glow--two" />

        <div className="auth-visual__content">
          <span className="auth-visual__badge">Your next home starts here</span>

          <blockquote>
            “A place to settle in, stay organized, and feel at home.”
          </blockquote>

          <p>
            Create your account today, then complete your accommodation
            application when you’re ready.
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

export default RegisterPage
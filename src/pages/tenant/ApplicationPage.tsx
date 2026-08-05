import { useEffect, useState } from 'react'
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  GraduationCap,
  HeartHandshake,
  House,
  UserRound,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'
import type { ApplicationFormValues } from '../../utils/applicationSchema'
import { applicationSchema } from '../../utils/applicationSchema'
import '../../styles/application.css'

interface ExistingApplication {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
}

function ApplicationPage() {
  const { profile } = useAuth()

  const [existingApplication, setExistingApplication] =
    useState<ExistingApplication | null>(null)

  const [isCheckingApplication, setIsCheckingApplication] =
    useState(true)

  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const applicantType = profile?.applicant_type ?? 'student'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    defaultValues: {
      applicant_type: applicantType,
      birth_date: '',
      gender: 'prefer_not_to_say',
      phone: '',
      current_address: '',
      school_name: '',
      course_name: '',
      student_number: '',
      employer_name: '',
      occupation: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      preferred_move_in_date: '',
      preferred_room_type: 'no_preference',
      reason_for_applying: '',
    },
  })

  useEffect(() => {
    async function checkExistingApplication() {
      if (!profile) {
        return
      }

      const { data, error } = await supabase
        .from('tenant_applications')
        .select('id, status, submitted_at')
        .eq('applicant_id', profile.id)
        .maybeSingle()

      if (error) {
        console.error('Unable to check application:', error.message)
      }

      setExistingApplication(data)
      setIsCheckingApplication(false)
    }

    void checkExistingApplication()
  }, [profile])

  async function submitApplication(values: ApplicationFormValues) {
    if (!profile) {
      setSubmitError('Your profile could not be loaded.')
      return
    }

    setSubmitError('')
    setSubmitSuccess('')

    const result = applicationSchema.safeParse({
      ...values,
      applicant_type: applicantType,
    })

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]

        if (typeof field === 'string') {
          setError(field as keyof ApplicationFormValues, {
            type: 'validation',
            message: issue.message,
          })
        }
      })

      setSubmitError(
        'Please review the highlighted fields before submitting.',
      )

      return
    }

    const application = result.data

    const { data, error } = await supabase
      .from('tenant_applications')
      .insert({
        applicant_id: profile.id,
        applicant_type: applicantType,

        birth_date: application.birth_date,
        gender: application.gender,

        phone: application.phone,
        current_address: application.current_address,

        school_name:
          applicantType === 'student'
            ? application.school_name || null
            : null,

        course_name:
          applicantType === 'student'
            ? application.course_name || null
            : null,

        student_number:
          applicantType === 'student'
            ? application.student_number || null
            : null,

        employer_name:
          applicantType === 'professional'
            ? application.employer_name || null
            : null,

        occupation:
          applicantType === 'professional'
            ? application.occupation || null
            : null,

        emergency_contact_name:
          application.emergency_contact_name,

        emergency_contact_phone:
          application.emergency_contact_phone,

        emergency_contact_relationship:
          application.emergency_contact_relationship,

        preferred_move_in_date:
          application.preferred_move_in_date,

        preferred_room_type:
          application.preferred_room_type,

        reason_for_applying:
          application.reason_for_applying || null,

        status: 'pending',
      })
      .select('id, status, submitted_at')
      .single()

    if (error) {
      setSubmitError(error.message)
      return
    }

    setExistingApplication(data)
    setSubmitSuccess('Your application was submitted successfully.')
  }

  if (isCheckingApplication) {
    return (
      <div className="application-loading">
        <div className="route-loader__spinner" />

        <p>Checking your application...</p>
      </div>
    )
  }

  if (existingApplication) {
    return (
      <div className="dashboard-page">
        <section className="application-status">
          <div
            className={`application-status__icon application-status__icon--${existingApplication.status}`}
          >
            <CircleCheck size={30} aria-hidden="true" />
          </div>

          <span className="dashboard-welcome__eyebrow">
            Application received
          </span>

          <h2>
            Your application is {existingApplication.status}.
          </h2>

          <p>
            Your accommodation application was submitted on{' '}
            <strong>
              {new Intl.DateTimeFormat('en-PH', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(
                new Date(existingApplication.submitted_at),
              )}
            </strong>
            .
          </p>

          {existingApplication.status === 'pending' && (
            <p>
              The dormitory administrator will review your details. You’ll
              see the result here once a decision has been made.
            </p>
          )}

          {existingApplication.status === 'approved' && (
            <p>
              Your application has been approved. The administrator can now
              assign you to an available bed.
            </p>
          )}

          {existingApplication.status === 'rejected' && (
            <p>
              Your application was not approved. Contact the dormitory
              administrator if you need additional information.
            </p>
          )}

          {submitSuccess && (
            <p className="form-success" role="status">
              {submitSuccess}
            </p>
          )}

          <Link to="/tenant" className="button button--primary">
            Return to dashboard
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <section className="application-intro">
        <div>
          <span className="dashboard-welcome__eyebrow">
            Accommodation application
          </span>

          <h2>Tell us a little about yourself.</h2>

          <p>
            Complete the form below so the dormitory administrator can review
            your accommodation request.
          </p>
        </div>

        <div className="application-intro__type">
          {applicantType === 'student' ? (
            <GraduationCap size={22} aria-hidden="true" />
          ) : (
            <BriefcaseBusiness size={22} aria-hidden="true" />
          )}

          <span>
            <small>Applying as</small>
            <strong>{applicantType}</strong>
          </span>
        </div>
      </section>

      <form
        className="application-form"
        onSubmit={handleSubmit(submitApplication)}
        noValidate
      >
        <input
          type="hidden"
          {...register('applicant_type')}
          value={applicantType}
        />

        <section className="application-section">
          <div className="application-section__heading">
            <div className="application-section__icon">
              <UserRound size={20} aria-hidden="true" />
            </div>

            <div>
              <h3>Personal details</h3>
              <p>Your basic contact and identification information.</p>
            </div>
          </div>

          <div className="application-fields application-fields--two">
            <div className="form-field">
              <label htmlFor="birth_date">Birth date</label>

              <input
                id="birth_date"
                type="date"
                className="form-control"
                {...register('birth_date')}
              />

              {errors.birth_date && (
                <small className="field-error">
                  {errors.birth_date.message}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="gender">Gender</label>

              <select
                id="gender"
                className="form-control"
                {...register('gender')}
              >
                <option value="prefer_not_to_say">
                  Prefer not to say
                </option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
              </select>

              {errors.gender && (
                <small className="field-error">
                  {errors.gender.message}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="phone">Phone number</label>

              <input
                id="phone"
                type="tel"
                className="form-control"
                placeholder="+63 900 000 0000"
                {...register('phone')}
              />

              {errors.phone && (
                <small className="field-error">
                  {errors.phone.message}
                </small>
              )}
            </div>

            <div className="form-field application-field--full">
              <label htmlFor="current_address">Current address</label>

              <textarea
                id="current_address"
                className="form-control"
                rows={3}
                placeholder="House number, street, barangay, city, province"
                {...register('current_address')}
              />

              {errors.current_address && (
                <small className="field-error">
                  {errors.current_address.message}
                </small>
              )}
            </div>
          </div>
        </section>

        <section className="application-section">
          <div className="application-section__heading">
            <div className="application-section__icon">
              {applicantType === 'student' ? (
                <GraduationCap size={20} aria-hidden="true" />
              ) : (
                <BriefcaseBusiness size={20} aria-hidden="true" />
              )}
            </div>

            <div>
              <h3>
                {applicantType === 'student'
                  ? 'Education'
                  : 'Employment'}
              </h3>

              <p>
                {applicantType === 'student'
                  ? 'Tell us where you are currently studying.'
                  : 'Tell us about your current employment.'}
              </p>
            </div>
          </div>

          {applicantType === 'student' ? (
            <div className="application-fields application-fields--two">
              <div className="form-field application-field--full">
                <label htmlFor="school_name">School name</label>

                <input
                  id="school_name"
                  className="form-control"
                  placeholder="Name of school or university"
                  {...register('school_name')}
                />

                {errors.school_name && (
                  <small className="field-error">
                    {errors.school_name.message}
                  </small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="course_name">Course or program</label>

                <input
                  id="course_name"
                  className="form-control"
                  placeholder="e.g. BS Information Technology"
                  {...register('course_name')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="student_number">
                  Student number
                </label>

                <input
                  id="student_number"
                  className="form-control"
                  placeholder="School identification number"
                  {...register('student_number')}
                />
              </div>
            </div>
          ) : (
            <div className="application-fields application-fields--two">
              <div className="form-field">
                <label htmlFor="employer_name">Employer name</label>

                <input
                  id="employer_name"
                  className="form-control"
                  placeholder="Company or business name"
                  {...register('employer_name')}
                />

                {errors.employer_name && (
                  <small className="field-error">
                    {errors.employer_name.message}
                  </small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="occupation">Occupation</label>

                <input
                  id="occupation"
                  className="form-control"
                  placeholder="Your current position"
                  {...register('occupation')}
                />
              </div>
            </div>
          )}
        </section>

        <section className="application-section">
          <div className="application-section__heading">
            <div className="application-section__icon">
              <HeartHandshake size={20} aria-hidden="true" />
            </div>

            <div>
              <h3>Emergency contact</h3>
              <p>Someone we can contact in case of an emergency.</p>
            </div>
          </div>

          <div className="application-fields application-fields--three">
            <div className="form-field">
              <label htmlFor="emergency_contact_name">
                Full name
              </label>

              <input
                id="emergency_contact_name"
                className="form-control"
                placeholder="Contact person’s name"
                {...register('emergency_contact_name')}
              />

              {errors.emergency_contact_name && (
                <small className="field-error">
                  {errors.emergency_contact_name.message}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="emergency_contact_phone">
                Phone number
              </label>

              <input
                id="emergency_contact_phone"
                type="tel"
                className="form-control"
                placeholder="+63 900 000 0000"
                {...register('emergency_contact_phone')}
              />

              {errors.emergency_contact_phone && (
                <small className="field-error">
                  {errors.emergency_contact_phone.message}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="emergency_contact_relationship">
                Relationship
              </label>

              <input
                id="emergency_contact_relationship"
                className="form-control"
                placeholder="e.g. Parent"
                {...register('emergency_contact_relationship')}
              />

              {errors.emergency_contact_relationship && (
                <small className="field-error">
                  {errors.emergency_contact_relationship.message}
                </small>
              )}
            </div>
          </div>
        </section>

        <section className="application-section">
          <div className="application-section__heading">
            <div className="application-section__icon">
              <House size={20} aria-hidden="true" />
            </div>

            <div>
              <h3>Accommodation preference</h3>
              <p>Your preferred move-in date and room arrangement.</p>
            </div>
          </div>

          <div className="application-fields application-fields--two">
            <div className="form-field">
              <label htmlFor="preferred_move_in_date">
                Preferred move-in date
              </label>

              <input
                id="preferred_move_in_date"
                type="date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                {...register('preferred_move_in_date')}
              />

              {errors.preferred_move_in_date && (
                <small className="field-error">
                  {errors.preferred_move_in_date.message}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="preferred_room_type">
                Preferred room
              </label>

              <select
                id="preferred_room_type"
                className="form-control"
                {...register('preferred_room_type')}
              >
                <option value="no_preference">No preference</option>
                <option value="single">Single room</option>
                <option value="double">Double-sharing room</option>
                <option value="shared">Shared room</option>
              </select>
            </div>

            <div className="form-field application-field--full">
              <label htmlFor="reason_for_applying">
                Why are you applying?
                <span> Optional</span>
              </label>

              <textarea
                id="reason_for_applying"
                className="form-control"
                rows={4}
                placeholder="Tell us anything that may help with your application."
                {...register('reason_for_applying')}
              />

              {errors.reason_for_applying && (
                <small className="field-error">
                  {errors.reason_for_applying.message}
                </small>
              )}
            </div>
          </div>
        </section>

        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}

        <div className="application-actions">
          <Link to="/tenant" className="button button--secondary">
            Save for later
          </Link>

          <button
            type="submit"
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting application...'
            ) : (
              <>
                <CalendarDays size={18} aria-hidden="true" />
                Submit application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationPage
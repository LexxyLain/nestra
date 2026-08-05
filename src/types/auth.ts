import type { Session, User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'tenant'

export type AccountStatus =
  | 'applicant'
  | 'pending'
  | 'approved'
  | 'active'
  | 'rejected'
  | 'former'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  account_status: AccountStatus
  applicant_type: 'student' | 'professional' | null
  avatar_url: string | null
}

export interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
}
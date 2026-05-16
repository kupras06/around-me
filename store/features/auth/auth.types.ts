import type { Session } from '@supabase/supabase-js';

export type OAuthProvider =
  | 'x'
  | 'google'
  | 'facebook'
  | 'github'
  | 'apple'
  | 'instagram';

export type AuthUser = {
  id: string;
  email?: string;
  providers: string[];
};

export type AuthState = {
  session: Session | null;
  authUser: AuthUser | null;
  initialized: boolean;
  loading: boolean;
};

export type RegisterPayload = {
  displayName: string;
  email?: string;
  password?: string;
};

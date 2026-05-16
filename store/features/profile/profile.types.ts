import type { Database } from '@/lib/database.types';
import type { OAuthProvider } from '../auth/auth.types';

export type UserType = 'creator' | 'user';

export type ProfileTier = 'verified' | 'trusted_local' | 'community';

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type Profile = Omit<ProfileRow, 'tier' | 'user_type'> & {
  is_admin: boolean;
  user_type: UserType | null;
  tier: ProfileTier | null;
  email: string;
};
export type LinkedAccountProvider = OAuthProvider | 'twitter';
export type LinkedAccountPatch = Partial<
  Record<LinkedAccountProvider, boolean>
>;
export type User = {
  id: string;
  email?: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  phone?: string;
  phone_linked: boolean;
  onboarding_completed: boolean;
  user_type: UserType | null;
  tier: ProfileTier | null;
  follower_count: number;
  is_admin: boolean;
  is_creator: boolean;
  providers: string[];
  twitter_linked: boolean;
  instagram_linked: boolean;
  facebook_linked: boolean;
};
export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | 'display_name'
    | 'avatar_url'
    | 'bio'
    | 'phone'
    | 'onboarding_completed'
    | 'user_type'
    | 'tier'
    | 'follower_count'
  >
>;

export type ProfileState = {
  userProfile: Profile | null;
  loading: boolean;
};

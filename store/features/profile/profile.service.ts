import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import type {
  Profile,
  ProfileRow,
  ProfileTier,
  ProfileUpdate,
  UserType,
} from './profile.types';

const isUserType = (value: string | null): value is UserType =>
  value === 'creator' || value === 'user';

const isProfileTier = (value: string | null): value is ProfileTier =>
  value === 'verified' || value === 'trusted_local' || value === 'community';

const mapProfileRow = (row: ProfileRow, email: string | null): Profile => ({
  user_id: row.user_id,
  created_at: row.created_at,
  display_name: row.display_name ?? 'User',
  avatar_url: row.avatar_url ?? null,
  bio: row.bio ?? null,
  phone: row.phone ?? null,
  onboarding_completed: row.onboarding_completed ?? false,
  user_type: isUserType(row.user_type) ? row.user_type : null,
  tier: isProfileTier(row.tier) ? row.tier : null,
  follower_count: row.follower_count ?? 0,
  username: row.username ?? null,
  is_admin: false,
  email: email ?? '',
});

export const fetchProfileById = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (error || userError) {
    logger.error('Error fetching profile', error || userError);
    throw error || userError;
  }

  return mapProfileRow(data as ProfileRow, userData?.user?.email ?? null);
};

export const ensureProfile = async (
  userId: string,
  defaults: Partial<ProfileUpdate> = {}
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: userId,
        onboarding_completed: false,
        ...defaults,
      },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (error || userError) {
    throw error || userError;
  }

  return mapProfileRow(data as ProfileRow, userData?.user?.email ?? null);
};

export const updateProfileById = async (
  userId: string,
  update: ProfileUpdate
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(update)
    .eq('user_id', userId)
    .select('*')
    .single();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (error || userError) {
    throw error || userError;
  }

  return mapProfileRow(data as ProfileRow, userData?.user?.email ?? null);
};

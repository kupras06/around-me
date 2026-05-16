import type { User as SupabaseUser, UserIdentity } from '@supabase/supabase-js';
import type { AuthUser } from './auth.types';

export const mapIdentityProviders = (
  identities?: UserIdentity[] | null
): string[] => {
  return Array.from(
    new Set(
      (identities ?? [])
        .map((identity) => identity.provider)
        .filter((provider): provider is string => Boolean(provider))
    )
  );
};

export const mapAuthUser = (user: SupabaseUser | null): AuthUser | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    providers: mapIdentityProviders(user.identities),
  };
};

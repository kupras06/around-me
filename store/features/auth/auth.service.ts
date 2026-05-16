import * as Linking from 'expo-linking';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { ensureProfile } from '@/store/features/profile/profile.service';
import { mapAuthUser, mapIdentityProviders } from './auth.mapper';
import type { AuthUser, RegisterPayload } from './auth.types';

export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
};

export const getCurrentAuthUser = async (): Promise<AuthUser | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  const authUser = mapAuthUser(user);

  if (!authUser) {
    return null;
  }

  return {
    ...authUser,
    providers: await getLinkedProviders(user.identities),
  };
};

export const getLinkedProviders = async (
  fallbackIdentities?: Parameters<typeof mapIdentityProviders>[0]
) => {
  const fallbackProviders = mapIdentityProviders(fallbackIdentities);

  const { data, error } = await supabase.auth.getUserIdentities();

  if (error) {
    logger.warn('Unable to load Supabase identities, using user.identities', {
      error,
    });
    return fallbackProviders;
  }

  return mapIdentityProviders(data.identities);
};

export const signInWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Enter your email and password.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    logger.error(`Login error: ${error.message}`, error);
    throw error;
  }

  if (!data.session || !data.user) {
    throw new Error('Sign in did not return a user.');
  }

  const authUser = mapAuthUser(data.user);

  if (!authUser) {
    throw new Error('Sign in did not return a user.');
  }

  return {
    session: data.session,
    authUser: {
      ...authUser,
      providers: await getLinkedProviders(data.user.identities),
    },
  };
};

export const signUpWithPassword = async ({
  displayName,
  email,
  password,
}: RegisterPayload) => {
  const cleanDisplayName = displayName.trim();
  const normalizedEmail = email?.trim().toLowerCase() ?? '';

  if (!cleanDisplayName) {
    throw new Error('Enter a display name.');
  }

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.session || !data.user) {
    throw new Error(
      'Supabase email confirmation is enabled. Disable email confirmation or add a confirm-email flow before using onboarding.'
    );
  }

  await ensureProfile(data.user.id, {
    display_name: cleanDisplayName,
    onboarding_completed: false,
  });

  const authUser = mapAuthUser(data.user);

  if (!authUser) {
    throw new Error('Registration did not return a user.');
  }

  return {
    session: data.session,
    authUser: {
      ...authUser,
      providers: await getLinkedProviders(data.user.identities),
    },
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Enter the email for your account.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: Linking.createURL('/auth/reset-password'),
  });

  if (error) {
    throw error;
  }
};

export const updateAuthPassword = async (password: string) => {
  if (!password) {
    throw new Error('Enter a new password.');
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw error;
  }
};

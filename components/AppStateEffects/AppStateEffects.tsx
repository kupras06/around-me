import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  bootstrapAuth,
  selectAuth,
  setAuthState,
  setRecoveringPassword,
} from '@/store/slices/authSlice';
import { selectTheme } from '@/store/slices/themeSlice';
import { supabase } from '@/lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

const AUTH_ROUTES = new Set(['login', 'register', 'reset-password']);

type LinkedAccounts = {
  twitter?: boolean;
  instagram?: boolean;
};

type UserMetadata = {
  displayName?: string;
  phone?: string;
  phoneLinked?: boolean;
  linkedAccounts?: LinkedAccounts;
  onboardingCompleted?: boolean;
};

type ThemeName = NonNullable<typeof UnistylesRuntime.themeName>;

const getThemeName = (mode: 'light' | 'dark', color: 'teal' | 'orange'): ThemeName => {
  const themeMap: Record<'light' | 'dark', Record<'teal' | 'orange', ThemeName>> = {
    light: {
      teal: 'lightTeal',
      orange: 'lightOrange',
    },
    dark: {
      teal: 'darkTeal',
      orange: 'darkOrange',
    },
  };

  return themeMap[mode][color];
};

const mapSupabaseUser = (user: SupabaseUser | null) => {
  if (!user) {
    return null;
  }

  const metadata = (user.user_metadata ?? {}) as UserMetadata;

  return {
    id: user.id,
    displayName: metadata.displayName ?? user.email?.split('@')[0] ?? 'User',
    email: user.email,
    phone: metadata.phone,
    phoneLinked: metadata.phoneLinked ?? false,
    linkedAccounts: metadata.linkedAccounts ?? {},
    onboardingCompleted: metadata.onboardingCompleted ?? false,
  };
};

export function AppStateEffects() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { user, loading, isRecoveringPassword, initialized } = useAppSelector(selectAuth);
  const { mode, color } = useAppSelector(selectTheme);

  useEffect(() => {
    void dispatch(bootstrapAuth());
  }, [dispatch]);

  useEffect(() => {
    const themeName = getThemeName(mode, color);
    UnistylesRuntime.setTheme(themeName);
    Appearance.setColorScheme(mode);
  }, [color, mode]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      dispatch(
        setAuthState({
          session,
          user: mapSupabaseUser(session?.user ?? null),
        }),
      );

      if (event === 'PASSWORD_RECOVERY') {
        dispatch(setRecoveringPassword(true));
        router.replace('/reset-password');
      }

      if (event === 'SIGNED_OUT') {
        dispatch(setRecoveringPassword(false));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router]);

  const currentRoute = segments[segments.length - 1];
  const isAuthRoute = currentRoute ? AUTH_ROUTES.has(currentRoute) : false;
  const isOnboardingRoute = segments[0] === 'onboarding';

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (isRecoveringPassword && currentRoute === 'reset-password') {
      return;
    }

    if (isRecoveringPassword && currentRoute !== 'reset-password') {
      router.replace('/reset-password');
      return;
    }

    if (!user) {
      if (isOnboardingRoute) {
        router.replace('/register');
      }
      return;
    }

    if (!user.onboardingCompleted && !isOnboardingRoute) {
      router.replace('/onboarding/link-phone');
      return;
    }

    if (user.onboardingCompleted && (isAuthRoute || isOnboardingRoute)) {
      router.replace('/');
    }
  }, [
    currentRoute,
    initialized,
    isAuthRoute,
    isOnboardingRoute,
    isRecoveringPassword,
    loading,
    router,
    user,
  ]);

  return null;
}

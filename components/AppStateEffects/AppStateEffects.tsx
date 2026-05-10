import type { Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { supabase } from '@/lib/supabase';
import {
  type ResolvedThemeMode,
  setStoredThemePreference,
} from '@/lib/theme-preference';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  bootstrapAuth,
  mapSupabaseUser,
  selectAuth,
  setAuthState,
  setRecoveringPassword,
} from '@/store/slices/authSlice';
import { selectTheme, setResolvedMode } from '@/store/slices/themeSlice';

const AUTH_ROUTES = new Set(['login', 'register', 'reset-password']);

type ThemeName = NonNullable<typeof UnistylesRuntime.themeName>;

const getThemeName = (mode: ResolvedThemeMode): ThemeName =>
  mode === 'dark' ? 'aroundmeDark' : 'aroundmeLight';

export function AppStateEffects() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { user, loading, isRecoveringPassword, initialized } =
    useAppSelector(selectAuth);
  const { mode, modePreference } = useAppSelector(selectTheme);

  useEffect(() => {
    void dispatch(bootstrapAuth());
  }, [dispatch]);

  useEffect(() => {
    const themeName = getThemeName(mode);
    UnistylesRuntime.setTheme(themeName);
    Appearance.setColorScheme(mode);
  }, [mode]);

  useEffect(() => {
    setStoredThemePreference(modePreference);
    if (modePreference === 'system') {
      const systemMode =
        Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
      dispatch(setResolvedMode(systemMode));
      Appearance.setColorScheme(null);
      return;
    }

    dispatch(setResolvedMode(modePreference));
  }, [dispatch, modePreference]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (modePreference !== 'system') {
        return;
      }

      dispatch(setResolvedMode(colorScheme === 'dark' ? 'dark' : 'light'));
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, modePreference]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      dispatch(
        setAuthState({
          session,
          user: mapSupabaseUser(session?.user ?? null),
        })
      );

      if (event === 'PASSWORD_RECOVERY') {
        dispatch(setRecoveringPassword(true));
        router.push('/reset-password');
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
      router.push('/reset-password');
      return;
    }

    if (!user) {
      if (isOnboardingRoute) {
        router.push('/register');
      }
      // Temporarily allow access to home page without authentication
      if (!isAuthRoute && !isOnboardingRoute) {
        return;
      }
      return;
    }

    if (!user.onboarding_completed && !isOnboardingRoute) {
      router.push('/onboarding/link-phone');
      return;
    }

    if (user.onboarding_completed && (isAuthRoute || isOnboardingRoute)) {
      router.push('/');
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

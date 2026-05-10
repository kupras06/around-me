import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { supabase } from '@/lib/supabase';
import { setStoredThemePreference } from '@/lib/theme-preference';
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

export function useAuthSubscription() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(
        setAuthState({
          session,
          user: mapSupabaseUser(session?.user ?? null),
        })
      );

      switch (event) {
        case 'PASSWORD_RECOVERY':
          dispatch(setRecoveringPassword(true));
          router.push('/reset-password');
          break;

        case 'SIGNED_OUT':
          dispatch(setRecoveringPassword(false));
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, router]);
}

export function useThemeSync() {
  const dispatch = useAppDispatch();
  const { mode, modePreference } = useAppSelector(selectTheme);
  useEffect(() => {
    const themeName = mode === 'dark' ? 'aroundmeDark' : 'aroundmeLight';

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
    if (modePreference !== 'system') {
      return;
    }
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setResolvedMode(colorScheme === 'dark' ? 'dark' : 'light'));
    });

    return () => subscription.remove();
  }, [dispatch, modePreference]);
}
function getRedirectRoute({
  user,
  initialized,
  loading,
  isRecoveringPassword,
  currentRoute,
  isAuthRoute,
  isOnboardingRoute,
}: {
  user: ReturnType<typeof selectAuth>['user'];
  initialized: boolean;
  loading: boolean;
  isRecoveringPassword: boolean;
  currentRoute?: string;
  isAuthRoute: boolean;
  isOnboardingRoute: boolean;
}) {
  if (!initialized || loading) {
    return null;
  }

  if (isRecoveringPassword && currentRoute !== 'reset-password') {
    return '/reset-password';
  }

  if (!user) {
    if (isOnboardingRoute) {
      return '/register';
    }

    return null;
  }

  if (!user.onboarding_completed && !isOnboardingRoute) {
    return '/onboarding/link-phone';
  }

  if (user.onboarding_completed && (isAuthRoute || isOnboardingRoute)) {
    return '/';
  }

  return null;
}
function useAuthRedirects() {
  const router = useRouter();
  const segments = useSegments();

  const { user, loading, initialized, isRecoveringPassword } =
    useAppSelector(selectAuth);

  const currentRoute = segments[segments.length - 1];

  const isAuthRoute = !!currentRoute && AUTH_ROUTES.has(currentRoute);

  const isOnboardingRoute = segments[0] === 'onboarding';

  useEffect(() => {
    const redirect = getRedirectRoute({
      user,
      initialized,
      loading,
      isRecoveringPassword,
      currentRoute,
      isAuthRoute,
      isOnboardingRoute,
    });

    if (redirect) {
      router.replace(redirect);
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
}
export function AppStateEffects() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(bootstrapAuth());
  }, [dispatch]);
  useThemeSync();
  useAuthSubscription();
  useAuthRedirects();
  return null;
}

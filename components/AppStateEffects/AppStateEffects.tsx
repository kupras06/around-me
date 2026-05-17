import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { supabase } from '@/lib/supabase';
import { setStoredThemePreference } from '@/lib/theme-preference';
import { getCurrentAuthUser } from '@/store/features/auth/auth.service';
import {
  bootstrapAuth,
  selectAuthState,
  setAuthState,
} from '@/store/features/auth/auth.slice';
import {
  clearProfile,
  fetchProfile,
  selectProfile,
} from '@/store/features/profile/profile.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTheme, setResolvedMode } from '@/store/slices/themeSlice';

const AUTH_ROUTES = new Set(['login', 'register', 'reset-password']);

export function useAuthSubscription() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void (async () => {
        const authUser = session ? await getCurrentAuthUser() : null;
        dispatch(setAuthState({ session, authUser }));

        if (authUser) {
          void dispatch(fetchProfile(authUser.id));
        } else {
          dispatch(clearProfile());
        }
      })();

      switch (event) {
        case 'PASSWORD_RECOVERY':
          router.push({
            pathname: '/auth/reset-password',
            params: { mode: 'recovery' },
          });
          break;

        case 'SIGNED_OUT':
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
  isAuthRoute,
  isOnboardingRoute,
}: {
  user: ReturnType<typeof selectProfile>;
  initialized: boolean;
  loading: boolean;
  isAuthRoute: boolean;
  isOnboardingRoute: boolean;
}) {
  if (!initialized || loading) {
    return null;
  }

  if (!user) {
    if (isOnboardingRoute) {
      return '/auth/register';
    }

    if (!isAuthRoute) {
      return '/auth/login';
    }

    return null;
  }

  if (!user.onboarding_completed && !isOnboardingRoute) {
    return '/onboarding';
  }

  if (user.onboarding_completed && isAuthRoute) {
    return '/';
  }

  return null;
}
function useAuthRedirects() {
  const router = useRouter();
  const segments = useSegments();

  const { authUser, loading, initialized } = useAppSelector(selectAuthState);
  const profile = useAppSelector(selectProfile);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const isLoading = loading || (!!authUser && profileLoading);
  const user = authUser && profile ? profile : null;

  const currentRoute = segments[segments.length - 1];

  const isAuthRoute = !!currentRoute && AUTH_ROUTES.has(currentRoute);

  const isOnboardingRoute = segments[0] === 'onboarding';

  useEffect(() => {
    const redirect = getRedirectRoute({
      user,
      initialized,
      loading: isLoading,
      isAuthRoute,
      isOnboardingRoute,
    });

    if (redirect) {
      router.replace(redirect);
    }
  }, [initialized, isAuthRoute, isOnboardingRoute, isLoading, router, user]);
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

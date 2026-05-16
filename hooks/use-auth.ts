import { invariant } from 'es-toolkit';
import { type Href, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { logger } from '@/lib/logger';
import {
  login,
  logout,
  register,
  resetPassword,
  selectAuthState,
  signInWithProvider,
  unlinkProvider,
  updatePassword,
} from '@/store/features/auth/auth.slice';
import type { OAuthProvider } from '@/store/features/auth/auth.types';
import {
  completeOnboarding,
  linkPhoneNumber,
  selectProfileState,
  setUserType,
  updateProfile,
} from '@/store/features/profile/profile.slice';
import type {
  LinkedAccountPatch,
  LinkedAccountProvider,
  ProfileUpdate,
  User,
} from '@/store/features/profile/profile.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const hasProvider = (providers: string[], provider: OAuthProvider) => {
  if (provider === 'x') {
    return providers.includes('x') || providers.includes('twitter');
  }

  return providers.includes(provider);
};

const normalizeLinkedAccountProvider = (
  provider: LinkedAccountProvider
): OAuthProvider => (provider === 'twitter' ? 'x' : provider);

const requireUserResult = (user: User | null) => {
  invariant(user, 'User is not authenticated');
  return user;
};

const buildUser = (
  authUser: ReturnType<typeof selectAuthState>['authUser'],
  profile: ReturnType<typeof selectProfileState>['userProfile']
): User | null => {
  if (!authUser || !profile) {
    return null;
  }

  const displayName =
    profile.display_name || authUser.email?.split('@')[0] || 'User';
  const twitterLinked = hasProvider(authUser.providers, 'x');
  const instagramLinked = hasProvider(authUser.providers, 'instagram');
  const facebookLinked = hasProvider(authUser.providers, 'facebook');

  return {
    id: authUser.id,
    email: authUser.email,
    display_name: displayName,
    avatar_url:
      profile.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`,
    bio: profile.bio ?? undefined,
    phone: profile.phone ?? undefined,
    phone_linked: Boolean(profile.phone),
    onboarding_completed: Boolean(profile.onboarding_completed),
    user_type: profile.user_type,
    tier: profile.tier,
    follower_count: profile.follower_count ?? 0,
    is_admin: profile.is_admin ?? false,
    is_creator: profile.user_type === 'creator',
    providers: authUser.providers,
    twitter_linked: twitterLinked,
    instagram_linked: instagramLinked,
    facebook_linked: facebookLinked,
  };
};

export const useLogout = ({
  redirectTo = '/auth/login',
}: {
  redirectTo?: Href;
} = {}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return () => {
    dispatch(logout()).unwrap();
    router.replace(redirectTo);
  };
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthState);

  return {
    ...auth,
    isAuthenticated: Boolean(auth.authUser),
    isRecoveringPassword: Boolean(auth.session && !auth.authUser),
    login: (email: string, password: string) =>
      dispatch(login({ email, password }))
        .unwrap()
        .then((result) =>
          requireUserResult(buildUser(result.authUser, result.profile))
        ),
    logout: () => dispatch(logout()).unwrap(),
    register: (opts: {
      displayName: string;
      email?: string;
      password?: string;
    }) =>
      dispatch(register(opts))
        .unwrap()
        .then((result) =>
          requireUserResult(buildUser(result.authUser, result.profile))
        ),
    resetPassword: (email: string) => dispatch(resetPassword(email)).unwrap(),
    updatePassword: (password: string) =>
      dispatch(updatePassword(password)).unwrap(),
    signInWithProvider: (provider: OAuthProvider) =>
      dispatch(signInWithProvider(provider)).unwrap(),
    unlinkProvider: (provider: OAuthProvider) =>
      dispatch(unlinkProvider(provider)).unwrap(),
  };
};

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector(selectProfileState);
  // invariant(profileState.userProfile, 'User profile is not available');
  return {
    ...profileState,
    userProfile: profileState.userProfile,
    updateProfile: (profile: ProfileUpdate) =>
      dispatch(updateProfile(profile)).unwrap(),
    linkPhoneNumber: (phone: string) =>
      dispatch(linkPhoneNumber(phone)).unwrap(),
    setUserType: (user_type: 'creator' | 'user') =>
      dispatch(setUserType({ user_type })).unwrap(),
    completeOnboarding: () => dispatch(completeOnboarding()).unwrap(),
  };
};

export const useCurrentUser = () => {
  const auth = useAuth();
  const profile = useProfile();
  const dispatch = useAppDispatch();
  const user = useMemo(
    () => buildUser(auth.authUser, profile.userProfile),
    [auth.authUser, profile.userProfile]
  );

  const linkAccounts = async (payload: LinkedAccountPatch) => {
    const providers = Object.entries(payload).filter(([, linked]) => !linked);

    await Promise.all(
      providers.map(([provider]) =>
        dispatch(
          unlinkProvider(
            normalizeLinkedAccountProvider(provider as LinkedAccountProvider)
          )
        ).unwrap()
      )
    );
  };

  return {
    ...auth,
    ...profile,
    user,
    loading: auth.loading || profile.loading,
    linkAccounts,
  };
};

export const useUser = () => {
  const auth = useCurrentUser();
  logger.info('auth', auth.session);
  invariant(auth.user, 'User is not authenticated');
  invariant(auth.user.email, 'User email is required');
  return {
    ...auth,
    user: auth.user,
  };
};

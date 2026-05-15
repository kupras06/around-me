import { invariant } from 'es-toolkit';
import { type Href, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  completeOnboarding,
  linkAccounts,
  linkPhoneNumber,
  login,
  logout,
  type OAuthProvider,
  register,
  resetPassword,
  selectAuth,
  setUserType,
  signInWithProvider,
  type UserMetadata,
  updatePassword,
  updateProfile,
} from '@/store/slices/authSlice';

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
  const auth = useAppSelector(selectAuth);
  return {
    ...auth,
    isAuthenticated: !!auth.user,
    login: (email: string, password: string) =>
      dispatch(login({ email, password }))
        .unwrap()
        .then((result) => result.user),
    logout: () => dispatch(logout()).unwrap(),
    register: (opts: {
      displayName: string;
      email?: string;
      password?: string;
    }) =>
      dispatch(register(opts))
        .unwrap()
        .then((result) => result.user),
    updateProfile: (user: UserMetadata) =>
      dispatch(updateProfile(user)).unwrap(),
    resetPassword: (email: string) => dispatch(resetPassword(email)).unwrap(),
    updatePassword: (password: string) =>
      dispatch(updatePassword(password)).unwrap(),
    linkPhoneNumber: (phone: string) =>
      dispatch(linkPhoneNumber(phone)).unwrap(),
    linkAccounts: (payload: { twitter?: boolean; instagram?: boolean }) =>
      dispatch(linkAccounts(payload)).unwrap(),
    signInWithProvider: (provider: OAuthProvider) =>
      dispatch(signInWithProvider(provider)).unwrap(),
    setUserType: (user_type: 'creator' | 'user') =>
      dispatch(setUserType({ user_type })).unwrap(),
    completeOnboarding: () => dispatch(completeOnboarding()).unwrap(),
  };
};

export const useUser = () => {
  const auth = useAuth();
  invariant(auth.user, 'User is not authenticated');
  invariant(auth.user.email, 'User email is required');
  return {
    ...auth,
    user: auth.user,
  };
};

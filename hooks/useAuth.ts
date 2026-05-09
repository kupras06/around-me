import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  completeOnboarding,
  linkAccounts,
  linkPhoneNumber,
  login,
  logout,
  register,
  resetPassword,
  selectAuth,
  updatePassword,
  updateProfile,
  type UserMetadata,
} from '@/store/slices/authSlice';
import { invariant } from 'es-toolkit';

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
    register: (opts: { displayName: string; email?: string; password?: string }) =>
      dispatch(register(opts))
        .unwrap()
        .then((result) => result.user),
    updateProfile: (user: Partial<UserMetadata>) => dispatch(updateProfile(user)).unwrap(),
    resetPassword: (email: string) => dispatch(resetPassword(email)).unwrap(),
    updatePassword: (password: string) => dispatch(updatePassword(password)).unwrap(),
    linkPhoneNumber: (phone: string) => dispatch(linkPhoneNumber(phone)).unwrap(),
    linkAccounts: (payload: { twitter?: boolean; instagram?: boolean }) =>
      dispatch(linkAccounts(payload)).unwrap(),
    completeOnboarding: () => dispatch(completeOnboarding()).unwrap(),
  };
};

export const useUser = () => {
  const auth = useAuth();
  invariant(auth.user, 'User is not authenticated');
  return {
    ...auth,
    user: auth.user,
  }
};

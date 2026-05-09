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
} from '@/store/slices/authSlice';

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
    resetPassword: (email: string) => dispatch(resetPassword(email)).unwrap(),
    updatePassword: (password: string) => dispatch(updatePassword(password)).unwrap(),
    linkPhoneNumber: (phone: string) => dispatch(linkPhoneNumber(phone)).unwrap(),
    linkAccounts: (payload: { twitter?: boolean; instagram?: boolean }) =>
      dispatch(linkAccounts(payload)).unwrap(),
    completeOnboarding: () => dispatch(completeOnboarding()).unwrap(),
  };
};
import type React from 'react';
import LoadingScreen from '@/components/AuthGate/LoadingScreen';
import LoginRequired from '@/components/AuthGate/LoginRequired';
import { useAuth } from '@/hooks/use-auth';

type PropsWithChildren = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: PropsWithChildren) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  return <>{children}</>;
}

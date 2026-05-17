import { useLocalSearchParams, usePathname } from 'expo-router';
import type React from 'react';
import LoadingScreen from '@/components/AuthGate/LoadingScreen';
import LoginRequired from '@/components/AuthGate/LoginRequired';
import { useAuth } from '@/hooks/use-auth';
import { buildCurrentRoute } from '@/lib/auth-redirect';

type AuthGateProps = {
  children: React.ReactNode;
  errorDescription?: string;
};

export default function AuthGate({
  children,
  errorDescription,
}: AuthGateProps) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <LoginRequired
        redirectTo={buildCurrentRoute(pathname, params)}
        errorDescription={errorDescription}
      />
    );
  }

  return <>{children}</>;
}

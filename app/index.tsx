import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return null;
  }
  if (token) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/login" />;
}

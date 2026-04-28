import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function NotaLayout() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href="/login" />;
  }
  return <Slot />;
}

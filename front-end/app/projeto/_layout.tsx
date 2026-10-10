import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProjetoLayout() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href='/onboarding' />;
  }
  return <Slot />;
}

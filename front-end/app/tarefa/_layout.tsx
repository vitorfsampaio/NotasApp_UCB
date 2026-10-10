import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function TarefaLayout() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href='/onboarding' />;
  }
  return <Slot />;
}

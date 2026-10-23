import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function NotaLayout() {
  const { token, isReady, onboardingCompleted, hasSelectedPlan } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href="/onboarding" />;
  }
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }
  if (!hasSelectedPlan) {
    return <Redirect href="/plans" />;
  }
  return <Slot />;
}

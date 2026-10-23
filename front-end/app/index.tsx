import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const {
    token,
    isReady,
    onboardingCompleted,
    hasSelectedPlan,
    deviceOnboardingSeen,
  } = useAuth();

  if (!isReady) {
    return null;
  }

  if (token) {
    if (!onboardingCompleted) {
      return <Redirect href="/onboarding" />;
    }
    if (!hasSelectedPlan) {
      return <Redirect href="/plans" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  if (!deviceOnboardingSeen) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}

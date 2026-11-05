import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function CicloLayout() {
  const { token, isReady, onboardingCompleted, hasSelectedPlan } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href='/onboarding' />;
  }
  if (!onboardingCompleted) {
    return <Redirect href='/onboarding' />;
  }
  if (!hasSelectedPlan) {
    return <Redirect href='/plans' />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

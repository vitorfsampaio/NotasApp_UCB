import React, { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import OnboardingView from '@/screens/Onboarding/view';
import { useAuth } from '@/hooks/useAuth';

export default function OnboardingScreen() {
  const router = useRouter();
  const {
    token,
    isReady,
    onboardingCompleted,
    deviceOnboardingSeen,
    completeOnboarding,
    markDeviceOnboardingSeen,
  } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        await completeOnboarding();
        router.replace('/(tabs)');
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Erro ao concluir onboarding.';
        if (Platform.OS === 'web') {
          window.alert(message);
        } else {
          Alert.alert('Erro', message);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    await markDeviceOnboardingSeen();
    router.replace('/register');
  }, [token, completeOnboarding, markDeviceOnboardingSeen, router]);

  if (!isReady) {
    return null;
  }

  if (token && onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  if (!token && deviceOnboardingSeen) {
    return <Redirect href="/login" />;
  }

  return <OnboardingView onStart={handleStart} loading={loading} />;
}

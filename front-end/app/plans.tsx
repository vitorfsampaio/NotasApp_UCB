import React, { useCallback, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import PlansView from '@/screens/Plans/view';
import { useAuth } from '@/hooks/useAuth';
import type { SubscriptionPlan } from '@/domain/models';

export default function PlansScreen() {
  const router = useRouter();
  const {
    token,
    isReady,
    onboardingCompleted,
    hasSelectedPlan,
    selectPlan,
  } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('pro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await selectPlan(selectedPlan);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : 'Não foi possível salvar o plano.'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, selectPlan, router]);

  if (!isReady) {
    return null;
  }

  if (!token) {
    return <Redirect href="/onboarding" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (hasSelectedPlan) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <PlansView
      selectedPlan={selectedPlan}
      onSelectPlan={setSelectedPlan}
      onContinue={handleContinue}
      loading={loading}
      errorMessage={error}
    />
  );
}

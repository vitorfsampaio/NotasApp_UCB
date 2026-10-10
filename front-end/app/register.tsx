import React, { useCallback, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import RegisterView from '@/screens/Register/view';
import { useAuth } from '@/hooks/useAuth';
import type { MainFocus, UsageType } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, token, isReady, onboardingCompleted, completeOnboarding } =
    useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usageType, setUsageType] = useState<UsageType | null>(null);
  const [mainFocus, setMainFocus] = useState<MainFocus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    if (!fullName.trim()) {
      setError('Informe seu nome completo.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!usageType) {
      setError('Escolha para que você vai usar o Planify.');
      return;
    }
    if (!mainFocus) {
      setError('Escolha o que quer organizar primeiro.');
      return;
    }
    setLoading(true);
    try {
      await register(
        username.trim(),
        password,
        fullName.trim(),
        usageType,
        mainFocus,
      );
      try {
        await completeOnboarding();
        console.log('Onboarding completo');
      } catch {
        console.log('Erro ao completar onboarding:', e);
      }
      router.replace('/');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }, [
    fullName,
    username,
    password,
    confirmPassword,
    usageType,
    mainFocus,
    register,
    completeOnboarding,
    router,
  ]);

  if (!isReady) {
    return null;
  }
  if (token && onboardingCompleted) {
    return <Redirect href='/(tabs)' />;
  }
  if (token && !onboardingCompleted) {
    return <Redirect href='/onboarding' />;
  }

  return (
    <RegisterView
      fullName={fullName}
      username={username}
      password={password}
      confirmPassword={confirmPassword}
      usageType={usageType}
      mainFocus={mainFocus}
      onFullNameChange={setFullName}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onUsageTypeChange={setUsageType}
      onMainFocusChange={setMainFocus}
      onSubmit={handleSubmit}
      onGoLogin={() => router.push('/login')}
      loading={loading}
      errorMessage={error}
    />
  );
}

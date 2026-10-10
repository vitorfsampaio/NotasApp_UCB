import React, { useCallback, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import RegisterView from '@/screens/Register/view';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, token, isReady, onboardingCompleted, completeOnboarding } =
    useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    setLoading(true);
    try {
      await register(username.trim(), password, fullName.trim());
      try {
        await completeOnboarding();
      } catch {
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
    register,
    completeOnboarding,
    router,
  ]);

  if (!isReady) {
    return null;
  }
  if (token && onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }
  if (token && !onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <RegisterView
      fullName={fullName}
      username={username}
      password={password}
      confirmPassword={confirmPassword}
      onFullNameChange={setFullName}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSubmit}
      onGoLogin={() => router.push('/login')}
      loading={loading}
      errorMessage={error}
    />
  );
}

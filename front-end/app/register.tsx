import React, { useCallback, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import RegisterView from '@/screens/Register/view';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, token, isReady } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await register(username.trim(), password);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }, [username, password, register, router]);

  if (!isReady) {
    return null;
  }
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <RegisterView
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoLogin={() => router.push('/login')}
      loading={loading}
      errorMessage={error}
    />
  );
}

import React, { useCallback, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import LoginView from '@/screens/Login/view';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, token, isReady } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }, [username, password, login, router]);

  if (!isReady) {
    return null;
  }
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <LoginView
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoRegister={() => router.push('/register')}
      loading={loading}
      errorMessage={error}
    />
  );
}

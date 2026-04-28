import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import SobreView from './view';
import { useAuth } from '@/hooks/useAuth';

const SobreScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/login');
  }, [logout, router]);

  return <SobreView onLogout={handleLogout} />;
};

export default SobreScreen; 
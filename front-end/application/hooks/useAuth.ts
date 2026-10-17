import { useContext } from 'react';
import { AuthContext } from '@/application/providers/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}

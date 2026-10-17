import { useContext } from 'react';
import { SecurityContext } from '@/application/providers/SecurityContext';

export function useSecurity() {
  return useContext(SecurityContext);
}
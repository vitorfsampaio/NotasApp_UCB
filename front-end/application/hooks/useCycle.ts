import { useContext } from 'react';
import { CycleContext } from '@/application/providers/CycleContext';

export function useCycle() {
  return useContext(CycleContext);
}

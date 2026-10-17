import { useContext } from 'react';
import { PlannerContext } from '@/application/providers/PlannerContext';

export function usePlanner() {
  return useContext(PlannerContext);
}

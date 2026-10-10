import { useContext } from 'react';
import { PlannerContext } from '@/context/PlannerContext';

export function usePlanner() {
  return useContext(PlannerContext);
}

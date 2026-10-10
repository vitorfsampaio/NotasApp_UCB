import type { MainFocus, UsageType } from '@/types';

export const usageTypeLabels: Record<UsageType, string> = {
  personal: 'Pessoal',
  professional: 'Profissional',
  studies: 'Estudos',
  family: 'Família',
};

export const mainFocusLabels: Record<MainFocus, string> = {
  tasks: 'Tarefas',
  schedule: 'Agenda',
  projects: 'Projetos',
  notes: 'Notas',
};

export function isUsageType(value: unknown): value is UsageType {
  return typeof value === 'string' && value in usageTypeLabels;
}

export function isMainFocus(value: unknown): value is MainFocus {
  return typeof value === 'string' && value in mainFocusLabels;
}

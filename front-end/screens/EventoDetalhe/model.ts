import type { ChipOption } from '@/components/ChipSelector';

export const eventCategoryOptions: ChipOption<string>[] = [
  { value: 'Trabalho', label: 'Trabalho' },
  { value: 'Projeto', label: 'Projeto' },
  { value: 'Equipe', label: 'Equipe' },
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Pessoal', label: 'Pessoal' },
];

export const durationOptions: ChipOption<number>[] = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h 30min' },
  { value: 120, label: '2h' },
  { value: 180, label: '3h' },
];

export const reminderOptions: ChipOption<number | null>[] = [
  { value: null, label: 'Sem lembrete' },
  { value: 0, label: 'Na hora' },
  { value: 10, label: '10 min antes' },
  { value: 30, label: '30 min antes' },
  { value: 60, label: '1h antes' },
  { value: 1440, label: '1 dia antes' },
];

import type {
  CycleDailyLog,
  CycleOverview,
  CyclePhase,
} from '@/domain/models';
import { addDays, isSameDay, startOfDay } from '@/data/dateUtils';
import { colors } from '@/constants/theme';

export type { CycleDailyLog, CycleOverview, CyclePhase };

export const PHASE_LABELS: Record<CyclePhase, string> = {
  period: 'Menstruação',
  fertile: 'Janela fértil',
  follicular: 'Pré-ovulação',
  luteal: 'Fase lútea',
  unknown: 'Sem previsão',
};

export const CYCLE_LEGEND = [
  { key: 'period', label: 'Menstruação', color: colors.period },
  { key: 'preOvulation', label: 'Pré-ovulação', color: colors.preOvulation },
  { key: 'ovulation', label: 'Ovulação', color: colors.ovulation },
  { key: 'fertile', label: 'Janela fértil', color: colors.fertile },
] as const;

export const FLOW_OPTIONS = [
  { value: '' as const, label: 'Nenhum' },
  { value: 'spotting' as const, label: 'Manchas' },
  { value: 'light' as const, label: 'Leve' },
  { value: 'medium' as const, label: 'Médio' },
  { value: 'heavy' as const, label: 'Intenso' },
];

export const MOOD_OPTIONS = [
  { value: '' as const, label: '—' },
  { value: 'calm' as const, label: 'Calma' },
  { value: 'happy' as const, label: 'Feliz' },
  { value: 'sensitive' as const, label: 'Sensível' },
  { value: 'anxious' as const, label: 'Ansiosa' },
  { value: 'tired' as const, label: 'Cansada' },
  { value: 'energetic' as const, label: 'Energica' },
  { value: 'irritated' as const, label: 'Irritada' },
];

export const SYMPTOM_OPTIONS = [
  'Cólica',
  'Dor de cabeça',
  'Inchaço',
  'Acne',
  'Náusea',
  'Dor nas costas',
  'Sensibilidade nos seios',
  'Desejo por comida',
  'Insônia',
  'Fadiga',
];

export interface CycleDayStatus {
  cycleDay: number | null;
  phase: CyclePhase;
  phaseLabel: string;
  dateLabel: string;
  headline: string;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  daysUntilNextPeriod: number | null;
  daysUntilOvulation: number | null;
  nextPeriodStart: string | null;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  predictionReady: boolean;
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortPt(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  const date = new Date(`${iso}T12:00:00`);
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  return `${day} ${month}`;
}

export function formatDayLabel(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  const today = startOfDay(new Date());
  if (isSameDay(date, today)) {
    return `Hoje, ${day} ${month}`;
  }
  return `${day} ${month}`;
}

function emptyStatus(date: Date): CycleDayStatus {
  return {
    cycleDay: null,
    phase: 'unknown',
    phaseLabel: PHASE_LABELS.unknown,
    dateLabel: formatDayLabel(date),
    headline: 'Registre sua última menstruação para ver previsões',
    isPeriod: false,
    isFertile: false,
    isOvulation: false,
    daysUntilNextPeriod: null,
    daysUntilOvulation: null,
    nextPeriodStart: null,
    ovulationDate: null,
    fertileWindowStart: null,
    fertileWindowEnd: null,
    predictionReady: false,
  };
}

export function getStatusForDate(
  overview: CycleOverview,
  selected: Date
): CycleDayStatus {
  const selectedDay = startOfDay(selected);
  const lastPeriodIso = overview.periods[0]?.startDate;
  if (!overview.predictionReady || !lastPeriodIso) {
    return emptyStatus(selectedDay);
  }

  const lastStart = startOfDay(new Date(`${lastPeriodIso}T12:00:00`));
  const cycleLength = Math.max(21, overview.cycleLength || 28);
  const periodLength = Math.max(1, overview.periodLength || 5);
  const luteal = Math.max(10, overview.settings.lutealPhaseLength || 14);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = Math.floor(
    (selectedDay.getTime() - lastStart.getTime()) / msPerDay
  );
  if (daysSince < 0) {
    return {
      ...emptyStatus(selectedDay),
      headline: 'Data anterior ao último período registrado',
    };
  }

  const cyclesSince = Math.floor(daysSince / cycleLength);
  const cycleStart = addDays(lastStart, cyclesSince * cycleLength);
  const cycleDay = daysSince - cyclesSince * cycleLength + 1;
  const ovulationOffset = Math.max(1, cycleLength - luteal);
  const ovulationDate = addDays(cycleStart, ovulationOffset - 1);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const periodEnd = addDays(cycleStart, periodLength - 1);
  const nextPeriodStart = addDays(cycleStart, cycleLength);

  const isPeriod =
    selectedDay.getTime() >= cycleStart.getTime() &&
    selectedDay.getTime() <= periodEnd.getTime();
  const isFertile =
    selectedDay.getTime() >= fertileStart.getTime() &&
    selectedDay.getTime() <= fertileEnd.getTime();
  const isOvulation = isSameDay(selectedDay, ovulationDate);

  let phase: CyclePhase = 'luteal';
  if (isPeriod) {
    phase = 'period';
  } else if (isOvulation || isFertile) {
    phase = 'fertile';
  } else if (selectedDay.getTime() < fertileStart.getTime()) {
    phase = 'follicular';
  }

  const daysUntilNextPeriod = Math.max(
    0,
    Math.floor((nextPeriodStart.getTime() - selectedDay.getTime()) / msPerDay)
  );
  const daysUntilOvulation = Math.floor(
    (ovulationDate.getTime() - selectedDay.getTime()) / msPerDay
  );

  let headline = '';
  if (isPeriod) {
    headline = `Dia ${cycleDay} da menstruação`;
  } else if (isOvulation) {
    headline = 'Hoje é o dia previsto de ovulação';
  } else if (isFertile) {
    headline = 'Você está na janela fértil';
  } else if (daysUntilOvulation > 0) {
    headline =
      daysUntilOvulation === 1
        ? 'A ovulação deve começar em 1 dia'
        : `A ovulação deve começar em ${daysUntilOvulation} dias`;
  } else if (daysUntilNextPeriod === 0) {
    headline = 'A menstruação pode começar neste dia';
  } else if (daysUntilNextPeriod === 1) {
    headline = '1 dia até a próxima menstruação';
  } else {
    headline = `${daysUntilNextPeriod} dias até a próxima menstruação`;
  }

  return {
    cycleDay,
    phase,
    phaseLabel: isOvulation ? 'Ovulação' : PHASE_LABELS[phase],
    dateLabel: formatDayLabel(selectedDay),
    headline,
    isPeriod,
    isFertile,
    isOvulation,
    daysUntilNextPeriod,
    daysUntilOvulation: daysUntilOvulation >= 0 ? daysUntilOvulation : null,
    nextPeriodStart: formatIsoDate(nextPeriodStart),
    ovulationDate: formatIsoDate(ovulationDate),
    fertileWindowStart: formatIsoDate(fertileStart),
    fertileWindowEnd: formatIsoDate(fertileEnd),
    predictionReady: true,
  };
}

export function todayHeadline(overview: CycleOverview): string {
  return getStatusForDate(overview, new Date()).headline;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartialNote {
  title: string;
  content: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  dueAt: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartialTask {
  title: string;
  category: string;
  dueAt: Date;
  completed?: boolean;
}

export type EventIcon =
  | 'calendar'
  | 'idea'
  | 'design'
  | 'search'
  | 'chat'
  | 'edit'
  | 'work'
  | 'heart';

export interface PlannerEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: EventIcon;
  startsAt: Date;
  durationMinutes: number;
  reminderMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartialPlannerEvent {
  title: string;
  category: string;
  description: string;
  icon: EventIcon;
  startsAt: Date;
  durationMinutes: number;
  reminderMinutes: number | null;
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartialProject {
  name: string;
  subtitle: string;
  progress: number;
}

export interface SecurityContact {
  id: string;
  name: string;
  phone: string;
}

export type UsageType = 'personal' | 'professional' | 'studies' | 'family';

export type MainFocus = 'tasks' | 'schedule' | 'projects' | 'notes';

export type SubscriptionPlan = 'free' | 'pro' | 'max';

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  onboardingCompleted: boolean;
  usageType: UsageType | null;
  mainFocus: MainFocus | null;
  plan: SubscriptionPlan | null;
}

export interface AuthSession {
  token: string;
  usuario: AuthUser;
}

export type CyclePhase =
  | 'period'
  | 'fertile'
  | 'follicular'
  | 'luteal'
  | 'unknown';

export type CycleFlow = '' | 'spotting' | 'light' | 'medium' | 'heavy';

export type CycleMood =
  | ''
  | 'calm'
  | 'happy'
  | 'sensitive'
  | 'anxious'
  | 'tired'
  | 'energetic'
  | 'irritated';

export interface CycleSettings {
  averageCycleLength: number;
  averagePeriodLength: number;
  lutealPhaseLength: number;
}

export interface CyclePeriod {
  id: string;
  startDate: string;
  endDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleDailyLog {
  id: string;
  date: string;
  flow: CycleFlow;
  mood: CycleMood;
  symptoms: string[];
  intimacy: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleOverview {
  settings: CycleSettings;
  periods: CyclePeriod[];
  currentCycleDay: number | null;
  cycleLength: number;
  periodLength: number;
  phase: CyclePhase;
  daysUntilNextPeriod: number | null;
  nextPeriodStart: string | null;
  nextPeriodEnd: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  ovulationDate: string | null;
  currentCycleStart: string | null;
  isPeriodToday: boolean;
  isFertileToday: boolean;
  predictionReady: boolean;
}

export interface PartialCycleLog {
  date: string;
  flow: CycleFlow;
  mood: CycleMood;
  symptoms: string[];
  intimacy: boolean;
  notes: string;
}

export interface PartialCyclePeriod {
  startDate: string;
  endDate?: string | null;
}

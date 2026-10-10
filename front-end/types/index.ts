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

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  onboardingCompleted: boolean;
  usageType: UsageType | null;
  mainFocus: MainFocus | null;
}

export interface AuthSession {
  token: string;
  usuario: AuthUser;
}

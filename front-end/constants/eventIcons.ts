import {
  Briefcase,
  CalendarDays,
  FilePen,
  Heart,
  Lightbulb,
  LucideIcon,
  MessageCircle,
  PenTool,
  ScanSearch,
} from 'lucide-react-native';
import type { EventIcon } from '@/domain/models';

export const eventIcons: Record<EventIcon, LucideIcon> = {
  calendar: CalendarDays,
  idea: Lightbulb,
  design: PenTool,
  search: ScanSearch,
  chat: MessageCircle,
  edit: FilePen,
  work: Briefcase,
  heart: Heart,
};

export const eventIconOptions: EventIcon[] = [
  'calendar',
  'idea',
  'design',
  'search',
  'chat',
  'edit',
  'work',
  'heart',
];

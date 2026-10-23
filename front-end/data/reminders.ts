import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PlannerEvent, Task } from '@/domain/models';
import { formatTime } from './dateUtils';

const REMINDER_CHANNEL_ID = 'planify-reminders';
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

let isConfigured = false;

type ScheduledReminder = {
  date: Date;
  title: string;
  body: string;
};

async function ensureConfigured(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  if (!isConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
        name: 'Eventos e lembretes',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2C322E',
      });
    }
    isConfigured = true;
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  if (!current.canAskAgain) {
    return false;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function describeReminder(minutes: number): string {
  if (minutes === 0) {
    return 'Começa agora';
  }
  if (minutes < 60) {
    return `Começa em ${minutes} min`;
  }
  if (minutes < 1440) {
    return `Começa em ${Math.round(minutes / 60)}h`;
  }
  return `Começa em ${Math.round(minutes / 1440)} dia(s)`;
}

function dayBeforeAtSameTime(startsAt: Date): Date {
  return new Date(startsAt.getTime() - DAY_MS);
}

function dayOfApproachingDate(startsAt: Date): Date {
  const morning = new Date(startsAt);
  morning.setHours(8, 0, 0, 0);
  if (startsAt.getTime() <= morning.getTime()) {
    return new Date(startsAt.getTime() - HOUR_MS);
  }
  return morning;
}

function buildEventReminders(event: PlannerEvent): ScheduledReminder[] {
  const reminders: ScheduledReminder[] = [
    {
      date: dayBeforeAtSameTime(event.startsAt),
      title: 'Evento amanhã',
      body: `${event.title} • ${formatTime(event.startsAt)}`,
    },
    {
      date: dayOfApproachingDate(event.startsAt),
      title: 'Evento próximo',
      body: `${event.title} está chegando hoje às ${formatTime(event.startsAt)}`,
    },
  ];

  if (event.reminderMinutes !== null) {
    const customDate = new Date(
      event.startsAt.getTime() - event.reminderMinutes * 60000
    );
    const alreadyCovered = reminders.some(
      (item) => Math.abs(item.date.getTime() - customDate.getTime()) < 60000
    );
    if (!alreadyCovered) {
      reminders.push({
        date: customDate,
        title: event.title,
        body: `${describeReminder(event.reminderMinutes)} • ${formatTime(event.startsAt)}`,
      });
    }
  }

  return reminders;
}

export async function syncReminders(
  events: PlannerEvent[],
  tasks: Task[]
): Promise<void> {
  try {
    const allowed = await ensureConfigured();
    if (!allowed) {
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = Date.now();

    const eventReminders = events.flatMap((event) => buildEventReminders(event));

    const taskReminders = tasks
      .filter((task) => !task.completed)
      .map((task) => ({
        date: task.dueAt,
        title: task.title,
        body: 'Hora de concluir esta tarefa',
      }));

    const upcoming = [...eventReminders, ...taskReminders].filter(
      (reminder) => reminder.date.getTime() > now
    );

    await Promise.all(
      upcoming.map((reminder) =>
        Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: true,
          },
          trigger: {
            date: reminder.date,
            channelId: REMINDER_CHANNEL_ID,
          },
        })
      )
    );
  } catch (error) {
    console.error('Erro ao agendar lembretes:', error);
  }
}

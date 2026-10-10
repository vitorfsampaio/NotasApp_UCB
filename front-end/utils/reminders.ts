import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PlannerEvent, Task } from '@/types';
import { formatTime } from './dateUtils';

const REMINDER_CHANNEL_ID = 'planify-reminders';

let isConfigured = false;

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
        name: 'Lembretes',
        importance: Notifications.AndroidImportance.HIGH,
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

    const eventReminders = events
      .filter((event) => event.reminderMinutes !== null)
      .map((event) => ({
        date: new Date(
          event.startsAt.getTime() - (event.reminderMinutes ?? 0) * 60000
        ),
        title: event.title,
        body: `${describeReminder(event.reminderMinutes ?? 0)} • ${formatTime(event.startsAt)}`,
      }));

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
          content: { title: reminder.title, body: reminder.body },
          trigger: { date: reminder.date, channelId: REMINDER_CHANNEL_ID },
        })
      )
    );
  } catch (error) {
    console.error('Erro ao agendar lembretes:', error);
  }
}

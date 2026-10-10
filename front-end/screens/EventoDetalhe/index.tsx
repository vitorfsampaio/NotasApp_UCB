import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePlanner } from '@/hooks/usePlanner';
import { confirmDestructive, showErrorAlert } from '@/utils/alerts';
import {
  formatDate,
  formatTime,
  maskDateInput,
  maskTimeInput,
  parseDateTimeInput,
} from '@/utils/dateUtils';
import type { EventIcon } from '@/types';
import EventoDetalheView from './view';

const NEW_EVENT_ID = 'novo';

function initialStart(dateParam?: string): Date {
  const now = new Date();
  const base = dateParam ? new Date(dateParam) : now;
  const result = Number.isNaN(base.getTime()) ? now : new Date(base);
  result.setHours(now.getHours() + 1, 0, 0, 0);
  return result;
}

const EventoDetalheScreen: React.FC = () => {
  const { id, data } = useLocalSearchParams<{ id: string; data?: string }>();
  const router = useRouter();
  const { events, createEvent, updateEvent, deleteEvent } = usePlanner();
  const isNewEvent = id === NEW_EVENT_ID;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<EventIcon>('calendar');
  const [dateText, setDateText] = useState(() =>
    formatDate(initialStart(data))
  );
  const [timeText, setTimeText] = useState(() =>
    formatTime(initialStart(data))
  );
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(10);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isNewEvent || hasLoadedRef.current) {
      return;
    }
    const event = events.find((item) => item.id === id);
    if (event) {
      hasLoadedRef.current = true;
      setTitle(event.title);
      setCategory(event.category);
      setDescription(event.description);
      setIcon(event.icon);
      setDateText(formatDate(event.startsAt));
      setTimeText(formatTime(event.startsAt));
      setDurationMinutes(event.durationMinutes);
      setReminderMinutes(event.reminderMinutes);
    }
  }, [id, isNewEvent, events]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleDateChange = useCallback(
    (text: string) => setDateText(maskDateInput(text)),
    []
  );

  const handleTimeChange = useCallback(
    (text: string) => setTimeText(maskTimeInput(text)),
    []
  );

  const handleSave = useCallback(async () => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Informe o título do evento.');
      return;
    }
    const startsAt = parseDateTimeInput(dateText, timeText);
    if (!startsAt) {
      setErrorMessage('Informe data (DD/MM/AAAA) e hora (HH:MM) válidas.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        icon,
        startsAt,
        durationMinutes,
        reminderMinutes,
      };
      if (isNewEvent) {
        await createEvent(payload);
      } else {
        await updateEvent(id, payload);
      }
      router.back();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao salvar o evento.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    title,
    category,
    description,
    icon,
    dateText,
    timeText,
    durationMinutes,
    reminderMinutes,
    isNewEvent,
    id,
    createEvent,
    updateEvent,
    router,
  ]);

  const handleDelete = useCallback(() => {
    confirmDestructive(
      'Excluir evento',
      'Deseja realmente excluir este evento?',
      () => {
        deleteEvent(id)
          .then(() => router.back())
          .catch((error: unknown) =>
            showErrorAlert(error, 'Erro ao excluir o evento.')
          );
      }
    );
  }, [deleteEvent, id, router]);

  return (
    <EventoDetalheView
      isNewEvent={isNewEvent}
      title={title}
      category={category}
      description={description}
      icon={icon}
      dateText={dateText}
      timeText={timeText}
      durationMinutes={durationMinutes}
      reminderMinutes={reminderMinutes}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onTitleChange={setTitle}
      onCategoryChange={setCategory}
      onDescriptionChange={setDescription}
      onIconChange={setIcon}
      onDateChange={handleDateChange}
      onTimeChange={handleTimeChange}
      onDurationChange={setDurationMinutes}
      onReminderChange={setReminderMinutes}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default EventoDetalheScreen;

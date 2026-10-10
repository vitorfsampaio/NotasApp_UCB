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
import TarefaDetalheView from './view';

const NEW_TASK_ID = 'nova';

function nextFullHour(): Date {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date;
}

const TarefaDetalheScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, createTask, updateTask, deleteTask } = usePlanner();
  const isNewTask = id === NEW_TASK_ID;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dateText, setDateText] = useState(() => formatDate(nextFullHour()));
  const [timeText, setTimeText] = useState(() => formatTime(nextFullHour()));
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isNewTask || hasLoadedRef.current) {
      return;
    }
    const task = tasks.find((item) => item.id === id);
    if (task) {
      hasLoadedRef.current = true;
      setTitle(task.title);
      setCategory(task.category);
      setDateText(formatDate(task.dueAt));
      setTimeText(formatTime(task.dueAt));
      setCompleted(task.completed);
    }
  }, [id, isNewTask, tasks]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleDateChange = useCallback(
    (text: string) => setDateText(maskDateInput(text)),
    []
  );

  const handleTimeChange = useCallback(
    (text: string) => setTimeText(maskTimeInput(text)),
    []
  );

  const handleCompletedChange = useCallback(
    (value: string) => setCompleted(value === 'done'),
    []
  );

  const handleSave = useCallback(async () => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Informe o título da tarefa.');
      return;
    }
    const dueAt = parseDateTimeInput(dateText, timeText);
    if (!dueAt) {
      setErrorMessage('Informe data (DD/MM/AAAA) e hora (HH:MM) válidas.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { title: title.trim(), category: category.trim(), dueAt };
      if (isNewTask) {
        await createTask(payload);
      } else {
        await updateTask(id, { ...payload, completed });
      }
      router.back();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao salvar a tarefa.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    title,
    category,
    dateText,
    timeText,
    completed,
    isNewTask,
    id,
    createTask,
    updateTask,
    router,
  ]);

  const handleDelete = useCallback(() => {
    confirmDestructive(
      'Excluir tarefa',
      'Deseja realmente excluir esta tarefa?',
      () => {
        deleteTask(id)
          .then(() => router.back())
          .catch((error: unknown) =>
            showErrorAlert(error, 'Erro ao excluir a tarefa.')
          );
      }
    );
  }, [deleteTask, id, router]);

  return (
    <TarefaDetalheView
      isNewTask={isNewTask}
      title={title}
      category={category}
      dateText={dateText}
      timeText={timeText}
      completed={completed}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onTitleChange={setTitle}
      onCategoryChange={setCategory}
      onDateChange={handleDateChange}
      onTimeChange={handleTimeChange}
      onCompletedChange={handleCompletedChange}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default TarefaDetalheScreen;

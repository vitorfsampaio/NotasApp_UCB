import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePlanner } from '@/hooks/usePlanner';
import { confirmDestructive, showErrorAlert } from '@/utils/alerts';
import ProjetoDetalheView from './view';
import { PROGRESS_STEP, clampProgress } from './model';

const NEW_PROJECT_ID = 'novo';

const ProjetoDetalheScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, createProject, updateProject, deleteProject } =
    usePlanner();
  const isNewProject = id === NEW_PROJECT_ID;

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isNewProject || hasLoadedRef.current) {
      return;
    }
    const project = projects.find((item) => item.id === id);
    if (project) {
      hasLoadedRef.current = true;
      setName(project.name);
      setSubtitle(project.subtitle);
      setProgress(project.progress);
    }
  }, [id, isNewProject, projects]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleIncreaseProgress = useCallback(
    () => setProgress((prev) => clampProgress(prev + PROGRESS_STEP)),
    []
  );

  const handleDecreaseProgress = useCallback(
    () => setProgress((prev) => clampProgress(prev - PROGRESS_STEP)),
    []
  );

  const handleSave = useCallback(async () => {
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage('Informe o nome do projeto.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        subtitle: subtitle.trim(),
        progress,
      };
      if (isNewProject) {
        await createProject(payload);
      } else {
        await updateProject(id, payload);
      }
      router.back();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro ao salvar o projeto.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    name,
    subtitle,
    progress,
    isNewProject,
    id,
    createProject,
    updateProject,
    router,
  ]);

  const handleDelete = useCallback(() => {
    confirmDestructive(
      'Excluir projeto',
      'Deseja realmente excluir este projeto?',
      () => {
        deleteProject(id)
          .then(() => router.back())
          .catch((error: unknown) =>
            showErrorAlert(error, 'Erro ao excluir o projeto.')
          );
      }
    );
  }, [deleteProject, id, router]);

  return (
    <ProjetoDetalheView
      isNewProject={isNewProject}
      name={name}
      subtitle={subtitle}
      progress={progress}
      isSaving={isSaving}
      errorMessage={errorMessage}
      onNameChange={setName}
      onSubtitleChange={setSubtitle}
      onIncreaseProgress={handleIncreaseProgress}
      onDecreaseProgress={handleDecreaseProgress}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
};

export default ProjetoDetalheScreen;

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  PartialPlannerEvent,
  PartialProject,
  PartialTask,
  PlannerEvent,
  Project,
  Task,
} from '@/domain/models';
import { useAuth } from '@/application/hooks/useAuth';
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasks,
  updateTaskRequest,
} from '@/data/api/tasksApi';
import {
  createEventRequest,
  deleteEventRequest,
  fetchEvents,
  updateEventRequest,
} from '@/data/api/eventsApi';
import {
  createProjectRequest,
  deleteProjectRequest,
  fetchProjects,
  updateProjectRequest,
} from '@/data/api/projectsApi';
import { syncReminders } from '@/data/reminders';

interface PlannerContextProps {
  tasks: Task[];
  events: PlannerEvent[];
  projects: Project[];
  isLoading: boolean;
  refreshPlanner: () => Promise<void>;
  createTask: (taskData: PartialTask) => Promise<Task>;
  updateTask: (id: string, taskData: Partial<PartialTask>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createEvent: (eventData: PartialPlannerEvent) => Promise<PlannerEvent>;
  updateEvent: (
    id: string,
    eventData: Partial<PartialPlannerEvent>
  ) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createProject: (projectData: PartialProject) => Promise<Project>;
  updateProject: (
    id: string,
    projectData: Partial<PartialProject>
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const missingSession = async (): Promise<never> => {
  throw new Error('Faça login para continuar.');
};

export const PlannerContext = createContext<PlannerContextProps>({
  tasks: [],
  events: [],
  projects: [],
  isLoading: false,
  refreshPlanner: async () => {},
  createTask: missingSession,
  updateTask: async () => {},
  toggleTask: async () => {},
  deleteTask: async () => {},
  createEvent: missingSession,
  updateEvent: async () => {},
  deleteEvent: async () => {},
  createProject: missingSession,
  updateProject: async () => {},
  deleteProject: async () => {},
});

interface PlannerProviderProps {
  children: React.ReactNode;
}

const sortTasks = (list: Task[]) =>
  [...list].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());

const sortEvents = (list: PlannerEvent[]) =>
  [...list].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

const sortProjects = (list: Project[]) =>
  [...list].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

export const PlannerProvider: React.FC<PlannerProviderProps> = ({
  children,
}) => {
  const { token, isReady } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requireToken = useCallback(() => {
    if (!token) {
      throw new Error('Faça login para continuar.');
    }
    return token;
  }, [token]);

  const refreshPlanner = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setEvents([]);
      setProjects([]);
      return;
    }
    setIsLoading(true);
    try {
      const [taskList, eventList, projectList] = await Promise.all([
        fetchTasks(token),
        fetchEvents(token),
        fetchProjects(token),
      ]);
      setTasks(sortTasks(taskList));
      setEvents(sortEvents(eventList));
      setProjects(sortProjects(projectList));
    } catch (error) {
      console.error('Erro ao carregar planner:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    void refreshPlanner();
  }, [isReady, refreshPlanner]);

  useEffect(() => {
    if (!token) {
      return;
    }
    void syncReminders(events, tasks);
  }, [token, events, tasks]);

  const createTask = useCallback(
    async (taskData: PartialTask) => {
      const created = await createTaskRequest(requireToken(), taskData);
      setTasks((prev) => sortTasks([...prev, created]));
      return created;
    },
    [requireToken]
  );

  const updateTask = useCallback(
    async (id: string, taskData: Partial<PartialTask>) => {
      const updated = await updateTaskRequest(requireToken(), id, taskData);
      setTasks((prev) =>
        sortTasks(prev.map((task) => (task.id === id ? updated : task)))
      );
    },
    [requireToken]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const current = tasks.find((task) => task.id === id);
      if (!current) {
        return;
      }
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      try {
        const updated = await updateTaskRequest(requireToken(), id, {
          completed: !current.completed,
        });
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        );
      } catch (error) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? current : task))
        );
        throw error;
      }
    },
    [tasks, requireToken]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskRequest(requireToken(), id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [requireToken]
  );

  const createEvent = useCallback(
    async (eventData: PartialPlannerEvent) => {
      const created = await createEventRequest(requireToken(), eventData);
      setEvents((prev) => sortEvents([...prev, created]));
      return created;
    },
    [requireToken]
  );

  const updateEvent = useCallback(
    async (id: string, eventData: Partial<PartialPlannerEvent>) => {
      const updated = await updateEventRequest(requireToken(), id, eventData);
      setEvents((prev) =>
        sortEvents(prev.map((event) => (event.id === id ? updated : event)))
      );
    },
    [requireToken]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      await deleteEventRequest(requireToken(), id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    },
    [requireToken]
  );

  const createProject = useCallback(
    async (projectData: PartialProject) => {
      const created = await createProjectRequest(requireToken(), projectData);
      setProjects((prev) => sortProjects([...prev, created]));
      return created;
    },
    [requireToken]
  );

  const updateProject = useCallback(
    async (id: string, projectData: Partial<PartialProject>) => {
      const updated = await updateProjectRequest(
        requireToken(),
        id,
        projectData
      );
      setProjects((prev) =>
        sortProjects(
          prev.map((project) => (project.id === id ? updated : project))
        )
      );
    },
    [requireToken]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await deleteProjectRequest(requireToken(), id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    },
    [requireToken]
  );

  const value = useMemo(
    () => ({
      tasks,
      events,
      projects,
      isLoading,
      refreshPlanner,
      createTask,
      updateTask,
      toggleTask,
      deleteTask,
      createEvent,
      updateEvent,
      deleteEvent,
      createProject,
      updateProject,
      deleteProject,
    }),
    [
      tasks,
      events,
      projects,
      isLoading,
      refreshPlanner,
      createTask,
      updateTask,
      toggleTask,
      deleteTask,
      createEvent,
      updateEvent,
      deleteEvent,
      createProject,
      updateProject,
      deleteProject,
    ]
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
};

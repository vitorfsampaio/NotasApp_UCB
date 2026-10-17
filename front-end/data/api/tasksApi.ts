import { getBaseUrl } from '@/data/http/client';
import type { PartialTask, Task } from '@/domain/models';

interface ApiTaskPayload {
  id: string;
  title: string;
  category: string;
  dueAt: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiTasksResponse {
  codigo: number;
  mensagem: string;
  tarefas?: ApiTaskPayload[];
  tarefa?: ApiTaskPayload;
}

function mapTask(payload: ApiTaskPayload): Task {
  return {
    id: payload.id,
    title: payload.title,
    category: payload.category,
    dueAt: new Date(payload.dueAt),
    completed: payload.completed,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

async function parseTasksResponse(
  response: Response
): Promise<ApiTasksResponse> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiTasksResponse;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function serializeTask(taskData: Partial<PartialTask>) {
  return {
    ...taskData,
    dueAt: taskData.dueAt ? taskData.dueAt.toISOString() : undefined,
  };
}

export async function fetchTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${getBaseUrl()}/api/tasks`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseTasksResponse(response);
  if (!response.ok || !data.tarefas) {
    throw new Error(data.mensagem || 'Não foi possível carregar as tarefas.');
  }
  return data.tarefas.map(mapTask);
}

export async function createTaskRequest(
  token: string,
  taskData: PartialTask
): Promise<Task> {
  const response = await fetch(`${getBaseUrl()}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(serializeTask(taskData)),
  });
  const data = await parseTasksResponse(response);
  if (!response.ok || !data.tarefa) {
    throw new Error(data.mensagem || 'Não foi possível criar a tarefa.');
  }
  return mapTask(data.tarefa);
}

export async function updateTaskRequest(
  token: string,
  id: string,
  taskData: Partial<PartialTask>
): Promise<Task> {
  const response = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(serializeTask(taskData)),
  });
  const data = await parseTasksResponse(response);
  if (!response.ok || !data.tarefa) {
    throw new Error(data.mensagem || 'Não foi possível atualizar a tarefa.');
  }
  return mapTask(data.tarefa);
}

export async function deleteTaskRequest(
  token: string,
  id: string
): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseTasksResponse(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível excluir a tarefa.');
  }
}

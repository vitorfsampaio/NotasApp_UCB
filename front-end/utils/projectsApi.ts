import { getApiBaseUrl } from '@/constants/config';
import type { PartialProject, Project } from '@/types';

interface ApiProjectPayload {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiProjectsResponse {
  codigo: number;
  mensagem: string;
  projetos?: ApiProjectPayload[];
  projeto?: ApiProjectPayload;
}

function mapProject(payload: ApiProjectPayload): Project {
  return {
    id: payload.id,
    name: payload.name,
    subtitle: payload.subtitle,
    progress: payload.progress,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

async function parseProjectsResponse(
  response: Response
): Promise<ApiProjectsResponse> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiProjectsResponse;
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

export async function fetchProjects(token: string): Promise<Project[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseProjectsResponse(response);
  if (!response.ok || !data.projetos) {
    throw new Error(data.mensagem || 'Não foi possível carregar os projetos.');
  }
  return data.projetos.map(mapProject);
}

export async function createProjectRequest(
  token: string,
  projectData: PartialProject
): Promise<Project> {
  const response = await fetch(`${getApiBaseUrl()}/api/projects`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(projectData),
  });
  const data = await parseProjectsResponse(response);
  if (!response.ok || !data.projeto) {
    throw new Error(data.mensagem || 'Não foi possível criar o projeto.');
  }
  return mapProject(data.projeto);
}

export async function updateProjectRequest(
  token: string,
  id: string,
  projectData: Partial<PartialProject>
): Promise<Project> {
  const response = await fetch(`${getApiBaseUrl()}/api/projects/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(projectData),
  });
  const data = await parseProjectsResponse(response);
  if (!response.ok || !data.projeto) {
    throw new Error(data.mensagem || 'Não foi possível atualizar o projeto.');
  }
  return mapProject(data.projeto);
}

export async function deleteProjectRequest(
  token: string,
  id: string
): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseProjectsResponse(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível excluir o projeto.');
  }
}

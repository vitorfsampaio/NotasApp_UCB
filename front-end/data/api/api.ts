import { authHeaders, getBaseUrl, jsonHeaders } from '@/data/http/client';

export async function enviarLigacaoEmergencia({
  numero,
  latitude,
  longitude,
  nome,
  gps_indisponivel,
  token,
}: {
  numero: string;
  latitude: number;
  longitude: number;
  nome: string;
  gps_indisponivel?: boolean;
  token?: string | null;
}) {
  try {
    const base = getBaseUrl();
    const response = await fetch(`${base}/api/ligacao-emergencia`, {
      method: 'POST',
      headers: token ? authHeaders(token) : jsonHeaders(),
      body: JSON.stringify({
        numero,
        latitude,
        longitude,
        nome,
        gps_indisponivel: Boolean(gps_indisponivel),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.mensagem || 'Erro desconhecido');
    }
    return data;
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Erro ao conectar com o servidor';
    throw new Error(msg);
  }
}

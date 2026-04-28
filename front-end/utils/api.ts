import { getApiBaseUrl } from '@/constants/config';

export async function enviarLigacaoEmergencia({
  numero,
  latitude,
  longitude,
  nome,
}: {
  numero: string;
  latitude: number;
  longitude: number;
  nome: string;
}) {
  try {
    const base = getApiBaseUrl();
    const response = await fetch(`${base}/api/ligacao-emergencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero, latitude, longitude, nome }),
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

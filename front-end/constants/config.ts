import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

type ExpoExtra = {
  apiBaseUrl?: string;
};

function isLanIpv4(host: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
}

function hostFromHttpUrl(url: string): string | null {
  const m = url.trim().match(/^https?:\/\/([^/:]+)/i);
  const h = m?.[1];
  if (!h || h === 'localhost' || h === '127.0.0.1') {
    return null;
  }
  return h;
}

function hostFromDebuggerString(dbg: unknown): string | null {
  if (typeof dbg !== 'string' || !dbg) {
    return null;
  }
  const host = dbg.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  return host;
}

function collectDevHosts(): string[] {
  const found: string[] = [];
  const push = (h: string | null) => {
    if (h && !found.includes(h)) {
      found.push(h);
    }
  };

  const raw = Constants as Record<string, unknown>;
  const expoGo = raw.expoGoConfig as { debuggerHost?: string } | undefined;
  const manifest = raw.manifest as { debuggerHost?: string; hostUri?: string } | undefined;
  const expoConfig = raw.expoConfig as { hostUri?: string } | undefined;

  push(hostFromDebuggerString(expoGo?.debuggerHost));
  push(hostFromDebuggerString(manifest?.debuggerHost));

  const hostUri = expoConfig?.hostUri ?? manifest?.hostUri;
  if (typeof hostUri === 'string') {
    const stripped = hostUri.replace(/^exp[a-z+]*:\/\//i, '').replace(/^\/\//, '');
    const first = stripped.split('/')[0];
    push(hostFromDebuggerString(first));
  }

  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (typeof scriptURL === 'string' && scriptURL.startsWith('http')) {
      push(hostFromHttpUrl(scriptURL));
    }
  } catch {}

  return found;
}

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;
  const fromExtra = extra?.apiBaseUrl?.trim();
  if (fromExtra) {
    return fromExtra;
  }

  const envUrl =
    typeof process.env.EXPO_PUBLIC_API_BASE_URL === 'string'
      ? process.env.EXPO_PUBLIC_API_BASE_URL.trim()
      : '';
  if (envUrl) {
    return envUrl;
  }

  const hosts = collectDevHosts();
  const lan = hosts.find((h) => isLanIpv4(h));
  if (lan) {
    return `http://${lan}:5000`;
  }
  if (hosts.length > 0) {
    return `http://${hosts[0]}:5000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://127.0.0.1:5000';
}

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, registerRequest } from '@/utils/authApi';
import { completeOnboardingRequest } from '@/utils/onboardingApi';
import type { AuthSession, AuthUser } from '@/types';

const AUTH_STORAGE_KEY = 'authSession';
const ONBOARDING_DEVICE_KEY = 'onboardingSeen';

interface AuthContextValue {
  token: string | null;
  usuario: AuthUser | null;
  isReady: boolean;
  onboardingCompleted: boolean;
  deviceOnboardingSeen: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  markDeviceOnboardingSeen: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  usuario: null,
  isReady: false,
  onboardingCompleted: false,
  deviceOnboardingSeen: false,
  login: async () => {},
  register: async () => {},
  completeOnboarding: async () => {},
  markDeviceOnboardingSeen: async () => {},
  logout: async () => {},
});

function isAuthSession(raw: unknown): raw is AuthSession {
  if (!raw || typeof raw !== 'object') {
    return false;
  }
  const o = raw as Record<string, unknown>;
  const u = o.usuario;
  if (!u || typeof u !== 'object') {
    return false;
  }
  const user = u as Record<string, unknown>;
  return (
    typeof o.token === 'string' &&
    typeof user.id === 'number' &&
    typeof user.username === 'string'
  );
}

function normalizeUsuario(user: AuthUser | Record<string, unknown>): AuthUser {
  return {
    id: Number(user.id),
    username: String(user.username),
    fullName: typeof user.fullName === 'string' ? user.fullName : '',
    onboardingCompleted: Boolean(user.onboardingCompleted),
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [deviceOnboardingSeen, setDeviceOnboardingSeen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [raw, seenRaw] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_DEVICE_KEY),
        ]);
        if (cancelled) {
          return;
        }
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isAuthSession(parsed)) {
            setSession({
              token: parsed.token,
              usuario: normalizeUsuario(parsed.usuario),
            });
          }
        }
        setDeviceOnboardingSeen(seenRaw === '1');
      } catch {
        setSession(null);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: AuthSession | null) => {
    if (next) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const next = await loginRequest(username, password);
      setSession(next);
      await persist(next);
    },
    [persist]
  );

  const register = useCallback(
    async (username: string, password: string, fullName: string) => {
      const next = await registerRequest(username, password, fullName);
      setSession(next);
      await persist(next);
    },
    [persist]
  );

  const completeOnboarding = useCallback(async () => {
    if (!session?.token) {
      throw new Error('Faça login para concluir o onboarding.');
    }
    const usuario = await completeOnboardingRequest(session.token);
    const next: AuthSession = { token: session.token, usuario };
    setSession(next);
    await persist(next);
    await AsyncStorage.setItem(ONBOARDING_DEVICE_KEY, '1');
    setDeviceOnboardingSeen(true);
  }, [session, persist]);

  const markDeviceOnboardingSeen = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_DEVICE_KEY, '1');
    setDeviceOnboardingSeen(true);
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    await persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      usuario: session?.usuario ?? null,
      isReady,
      onboardingCompleted: Boolean(session?.usuario?.onboardingCompleted),
      deviceOnboardingSeen,
      login,
      register,
      completeOnboarding,
      markDeviceOnboardingSeen,
      logout,
    }),
    [
      session,
      isReady,
      deviceOnboardingSeen,
      login,
      register,
      completeOnboarding,
      markDeviceOnboardingSeen,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

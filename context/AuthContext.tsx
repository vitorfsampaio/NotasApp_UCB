import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, registerRequest } from '@/utils/authApi';
import type { AuthSession, AuthUser } from '@/types';

const AUTH_STORAGE_KEY = 'authSession';

interface AuthContextValue {
  token: string | null;
  usuario: AuthUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  usuario: null,
  isReady: false,
  login: async () => {},
  register: async () => {},
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

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (cancelled) {
          return;
        }
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isAuthSession(parsed)) {
            setSession(parsed);
          }
        }
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

  const login = useCallback(async (username: string, password: string) => {
    const next = await loginRequest(username, password);
    setSession(next);
    await persist(next);
  }, [persist]);

  const register = useCallback(async (username: string, password: string) => {
    const next = await registerRequest(username, password);
    setSession(next);
    await persist(next);
  }, [persist]);

  const logout = useCallback(async () => {
    setSession(null);
    await persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      usuario: session?.usuario ?? null,
      isReady,
      login,
      register,
      logout,
    }),
    [session, isReady, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

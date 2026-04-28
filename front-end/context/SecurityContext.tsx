import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { SecurityContact } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviarLigacaoEmergencia } from '@/utils/api';
import {
  evaluateSosModeFromTaps,
  trimOldTaps,
} from '@/utils/sosTapEngine';

interface SecurityContextProps {
  safetyKeyword: string;
  setSafetyKeyword: (keyword: string) => void;
  contacts: SecurityContact[];
  addContact: (contact: SecurityContact) => void;
  removeContact: (id: string) => void;
  sendLocationEnabled: boolean;
  setSendLocationEnabled: (enabled: boolean) => void;
  makeCallEnabled: boolean;
  setMakeCallEnabled: (enabled: boolean) => void;
  saveSecuritySettings: () => Promise<void>;
  authenticateForSecurityAccess: () => Promise<boolean>;
  checkForKeyword: (text: string) => void;
  onHeaderSecretTap: () => Promise<void>;
}

export const SecurityContext = createContext<SecurityContextProps>({
  safetyKeyword: '',
  setSafetyKeyword: () => {},
  contacts: [],
  addContact: () => {},
  removeContact: () => {},
  sendLocationEnabled: true,
  setSendLocationEnabled: () => {},
  makeCallEnabled: true,
  setMakeCallEnabled: () => {},
  saveSecuritySettings: async () => {},
  authenticateForSecurityAccess: async () => false,
  checkForKeyword: () => {},
  onHeaderSecretTap: async () => {},
});

interface SecurityProviderProps {
  children: React.ReactNode;
}

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
};

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const [safetyKeyword, setSafetyKeyword] = useState('');
  const [contacts, setContacts] = useState<SecurityContact[]>([]);
  const [sendLocationEnabled, setSendLocationEnabled] = useState(true);
  const [makeCallEnabled, setMakeCallEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastKnownLatitude, setLastKnownLatitude] = useState<number | null>(
    null
  );
  const [lastKnownLongitude, setLastKnownLongitude] = useState<number | null>(
    null
  );
  const secretTapTimestampsRef = useRef<number[]>([]);

  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const settings = await storage.getItem('securitySettings');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          setSafetyKeyword(parsedSettings.safetyKeyword || '');
          setContacts(parsedSettings.contacts || []);
          setSendLocationEnabled(
            parsedSettings.sendLocationEnabled !== undefined
              ? parsedSettings.sendLocationEnabled
              : true
          );
          setMakeCallEnabled(
            parsedSettings.makeCallEnabled !== undefined
              ? parsedSettings.makeCallEnabled
              : true
          );
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de segurança:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSecuritySettings();
  }, []);

  const saveSecuritySettings = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const settings = {
        safetyKeyword,
        contacts,
        sendLocationEnabled,
        makeCallEnabled,
      };
      await storage.setItem('securitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de segurança:', error);
    }
  }, [safetyKeyword, contacts, sendLocationEnabled, makeCallEnabled, isInitialized]);

  const addContact = useCallback((contact: SecurityContact) => {
    setContacts((prev) => [...prev, contact]);
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, []);

  const authenticateForSecurityAccess = useCallback(async () => {
    if (Platform.OS === 'web') {
      return true;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Sem autenticação biométrica',
          'Seu dispositivo não tem suporte a autenticação biométrica ou não há nenhuma biometria cadastrada.',
          [{ text: 'OK' }]
        );
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticar para acessar configurações de segurança',
        fallbackLabel: 'Use sua senha',
      });

      return result.success;
    } catch (error) {
      console.error('Erro durante autenticação:', error);
      return false;
    }
  }, []);

  const runEmergencyProtocol = useCallback(
    async (silentSuccess: boolean) => {
      if (contacts.length === 0) {
        if (!silentSuccess) {
          Alert.alert(
            'Emergência',
            'Nenhum contato de emergência cadastrado.'
          );
        }
        return;
      }

      try {
        let latitude: number | null = null;
        let longitude: number | null = null;
        let gpsIndisponivel = false;
        const nome = contacts[0]?.name || 'Usuário';

        if (sendLocationEnabled) {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });
              latitude = location.coords.latitude;
              longitude = location.coords.longitude;
              setLastKnownLatitude(latitude);
              setLastKnownLongitude(longitude);
            } else {
              if (
                lastKnownLatitude !== null &&
                lastKnownLongitude !== null
              ) {
                latitude = lastKnownLatitude;
                longitude = lastKnownLongitude;
              } else {
                gpsIndisponivel = true;
                latitude = 0;
                longitude = 0;
              }
            }
          } catch {
            if (
              lastKnownLatitude !== null &&
              lastKnownLongitude !== null
            ) {
              latitude = lastKnownLatitude;
              longitude = lastKnownLongitude;
            } else {
              gpsIndisponivel = true;
              latitude = 0;
              longitude = 0;
            }
          }
        } else {
          latitude = 0;
          longitude = 0;
          gpsIndisponivel = true;
        }

        const contato = contacts[0];
        if (!contato) {
          if (!silentSuccess) {
            Alert.alert(
              'Emergência',
              'Nenhum contato de emergência cadastrado.'
            );
          }
          return;
        }

        await enviarLigacaoEmergencia({
          numero: contato.phone,
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          nome,
          gps_indisponivel: gpsIndisponivel,
        });

        if (!silentSuccess) {
          Alert.alert(
            'Emergência',
            'Ligação e SMS de emergência enviados com sucesso!'
          );
        }
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : 'Erro ao acionar emergência.';
        Alert.alert('Erro', msg);
      }
    },
    [
      contacts,
      sendLocationEnabled,
      lastKnownLatitude,
      lastKnownLongitude,
    ]
  );

  const checkForKeyword = useCallback(
    (text: string) => {
      if (!safetyKeyword || safetyKeyword.length < 3) return;

      if (text.toLowerCase().includes(safetyKeyword.toLowerCase())) {
        void runEmergencyProtocol(false);
      }
    },
    [safetyKeyword, runEmergencyProtocol]
  );

  const onHeaderSecretTap = useCallback(async () => {
    const now = Date.now();
    secretTapTimestampsRef.current = trimOldTaps(
      [...secretTapTimestampsRef.current, now],
      now
    );
    const mode = evaluateSosModeFromTaps(secretTapTimestampsRef.current, now);
    if (mode === 'active') {
      secretTapTimestampsRef.current = [];
      await runEmergencyProtocol(true);
    }
  }, [runEmergencyProtocol]);

  useEffect(() => {
    if (isInitialized) {
      saveSecuritySettings();
    }
  }, [
    safetyKeyword,
    contacts,
    sendLocationEnabled,
    makeCallEnabled,
    isInitialized,
    saveSecuritySettings,
  ]);

  return (
    <SecurityContext.Provider
      value={{
        safetyKeyword,
        setSafetyKeyword,
        contacts,
        addContact,
        removeContact,
        sendLocationEnabled,
        setSendLocationEnabled,
        makeCallEnabled,
        setMakeCallEnabled,
        saveSecuritySettings,
        authenticateForSecurityAccess,
        checkForKeyword,
        onHeaderSecretTap,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

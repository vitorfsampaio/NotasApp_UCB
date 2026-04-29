import Constants from 'expo-constants';

export function isE2eBuild(): boolean {
  if (process.env.EXPO_PUBLIC_E2E === '1') {
    return true;
  }
  const extra = Constants.expoConfig?.extra as { e2e?: boolean } | undefined;
  return extra?.e2e === true;
}

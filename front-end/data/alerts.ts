import { Alert, Platform } from 'react-native';

export function showErrorAlert(error: unknown, fallback: string): void {
  const message = error instanceof Error ? error.message : fallback;
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Erro', message);
  }
}

export function confirmDestructive(
  title: string,
  message: string,
  onConfirm: () => void
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onConfirm },
  ]);
}

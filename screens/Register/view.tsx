import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RegisterViewProps {
  username: string;
  password: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  onGoLogin: () => void;
  loading: boolean;
  errorMessage: string | null;
}

const RegisterView: React.FC<RegisterViewProps> = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onGoLogin,
  loading,
  errorMessage,
}) => (
  <View style={styles.background}>
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Usuário: 3 a 32 caracteres (letras, números ou _). Senha: no mínimo 6
            caracteres.
          </Text>
          <View style={styles.card}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={onUsernameChange}
              placeholder="Escolha um usuário"
              placeholderTextColor="#9E9E9E"
              selectionColor="#0074D9"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Defina uma senha"
              placeholderTextColor="#9E9E9E"
              selectionColor="#0074D9"
              secureTextEntry
              editable={!loading}
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryDisabled]}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondary}
              onPress={onGoLogin}
              disabled={loading}
              hitSlop={{ top: 12, bottom: 12 }}
            >
              <Text style={styles.secondaryText}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#e8eef5' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0074D9',
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0074D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  error: { color: '#FF4136', fontSize: 14, marginBottom: 12 },
  primaryBtn: {
    borderRadius: 12,
    marginTop: 4,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0074D9',
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter-Bold',
  },
  secondary: { marginTop: 20, alignItems: 'center' },
  secondaryText: { color: '#0074D9', fontSize: 16, fontFamily: 'Inter-Medium' },
});

export default RegisterView;

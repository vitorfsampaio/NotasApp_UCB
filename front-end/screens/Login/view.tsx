import React, { memo } from 'react';
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
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors, fonts, radii, shadows } from '@/constants/theme';

interface LoginViewProps {
  username: string;
  password: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  onGoRegister: () => void;
  loading: boolean;
  errorMessage: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onGoRegister,
  loading,
  errorMessage,
}) => (
  <PlanifyBackground>
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Entre para continuar suas anotações.
            </Text>
          </View>

          <View style={styles.card}>
            <TextInput
              testID="e2e_login_username"
              style={styles.input}
              value={username}
              onChangeText={onUsernameChange}
              placeholder="Nome de usuário"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TextInput
              testID="e2e_login_password"
              style={styles.input}
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Insira sua senha"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              secureTextEntry
              editable={!loading}
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              testID="e2e_login_submit"
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkWrap}
            onPress={onGoRegister}
            disabled={loading}
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <Text style={styles.link}>Criar conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 36,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: radii.card,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: 14,
    ...shadows.soft,
  },
  input: {
    backgroundColor: colors.input,
    height: 56,
    borderRadius: radii.input,
    paddingHorizontal: 22,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    ...shadows.soft,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.button,
    height: 56,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.buttonBorder,
    ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.3,
  },
  linkWrap: {
    marginTop: 28,
    alignItems: 'center',
  },
  link: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
    textDecorationLine: 'underline',
  },
});

export default memo(LoginView);

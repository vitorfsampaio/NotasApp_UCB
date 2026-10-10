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
import HandwrittenNote from '@/components/HandwrittenNote';
import AuthHero from '@/components/AuthHero';
import { colors, fonts, radii, shadows } from '@/constants/theme';

const loginHighlights = ['Tarefas do dia', 'Agenda', 'Lembretes'];

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
  <PlanifyBackground showLeaves>
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <AuthHero
            tagline='Planeje hoje. Construa amanhã.'
            highlights={loginHighlights}
          />
          <View style={styles.header}>
            <HandwrittenNote
              lines={['Pequenos passos', 'Grandes resultados']}
              accent='arrow'
              style={styles.note}
            />
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Entre para continuar organizando seu dia.
            </Text>
          </View>

          <View style={styles.card}>
            <TextInput
              testID='e2e_login_username'
              style={styles.input}
              value={username}
              onChangeText={onUsernameChange}
              placeholder='Nome de usuário'
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              autoCapitalize='none'
              autoCorrect={false}
              editable={!loading}
            />
            <TextInput
              testID='e2e_login_password'
              style={styles.input}
              value={password}
              onChangeText={onPasswordChange}
              placeholder='Insira sua senha'
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              secureTextEntry
              editable={!loading}
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              testID='e2e_login_submit'
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
    paddingTop: 20,
    paddingBottom: 36,
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  note: {
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.text,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 18,
    gap: 12,
    ...shadows.soft,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    height: 52,
    borderRadius: radii.input,
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  button: {
    marginTop: 6,
    backgroundColor: colors.button,
    height: 54,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.white,
  },
  linkWrap: {
    marginTop: 28,
    alignItems: 'center',
  },
  link: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
});

export default memo(LoginView);

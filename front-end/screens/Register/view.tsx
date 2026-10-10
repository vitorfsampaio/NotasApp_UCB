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
import {
  Briefcase,
  CalendarDays,
  FileText,
  FolderKanban,
  GraduationCap,
  ListChecks,
  LucideIcon,
  User,
  Users,
} from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import HandwrittenNote from '@/components/HandwrittenNote';
import AuthHero from '@/components/AuthHero';
import ChipSelector, { ChipOption } from '@/components/ChipSelector';
import { colors, fonts, radii, shadows } from '@/constants/theme';
import { mainFocusLabels, usageTypeLabels } from '@/constants/userPreferences';
import type { MainFocus, UsageType } from '@/types';

interface RegisterViewProps {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  usageType: UsageType | null;
  mainFocus: MainFocus | null;
  onFullNameChange: (text: string) => void;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  onUsageTypeChange: (value: UsageType | null) => void;
  onMainFocusChange: (value: MainFocus | null) => void;
  onSubmit: () => void;
  onGoLogin: () => void;
  loading: boolean;
  errorMessage: string | null;
}

const registerHighlights = ['Tarefas', 'Agenda', 'Projetos', 'Notas'];

const usageTypeIcons: Record<UsageType, LucideIcon> = {
  personal: User,
  professional: Briefcase,
  studies: GraduationCap,
  family: Users,
};

const mainFocusIcons: Record<MainFocus, LucideIcon> = {
  tasks: ListChecks,
  schedule: CalendarDays,
  projects: FolderKanban,
  notes: FileText,
};

function buildOptions<T extends string>(
  labels: Record<T, string>,
  icons: Record<T, LucideIcon>,
): ChipOption<T | null>[] {
  return (Object.keys(labels) as T[]).map((value) => {
    const Icon: LucideIcon = icons[value];
    return {
      value,
      label: labels[value],
      icon: <Icon size={14} color={colors.text} strokeWidth={1.8} />,
    };
  });
}

const usageTypeOptions = buildOptions(usageTypeLabels, usageTypeIcons);
const mainFocusOptions = buildOptions(mainFocusLabels, mainFocusIcons);

const RegisterView: React.FC<RegisterViewProps> = ({
  fullName,
  username,
  password,
  confirmPassword,
  usageType,
  mainFocus,
  onFullNameChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onUsageTypeChange,
  onMainFocusChange,
  onSubmit,
  onGoLogin,
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
            tagline='Seu dia organizado do seu jeito.'
            highlights={registerHighlights}
            height={170}
          />
          <View style={styles.header}>
            <HandwrittenNote
              lines={['Seu novo', 'começo']}
              accent='arrow'
              style={styles.note}
            />
            <Text style={styles.title}>Bem vindo a bordo!</Text>
            <Text style={styles.subtitle}>
              Vamos dar início a suas atividades.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Seus dados</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={onFullNameChange}
              placeholder='Nome completo'
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              editable={!loading}
            />
            <TextInput
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
              style={styles.input}
              value={password}
              onChangeText={onPasswordChange}
              placeholder='Insira sua senha'
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              secureTextEntry
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              placeholder='Confirme sua senha'
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.buttonSolid}
              secureTextEntry
              editable={!loading}
            />

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Sobre você</Text>
            <ChipSelector
              label='Para que você vai usar o Planify?'
              options={usageTypeOptions}
              selected={usageType}
              onSelect={onUsageTypeChange}
            />
            <ChipSelector
              label='O que quer organizar primeiro?'
              options={mainFocusOptions}
              selected={mainFocus}
              onSelect={onMainFocusChange}
            />

            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkWrap}
            onPress={onGoLogin}
            disabled={loading}
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <Text style={styles.link}>Já tenho conta</Text>
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
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  divider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: colors.divider,
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

export default memo(RegisterView);

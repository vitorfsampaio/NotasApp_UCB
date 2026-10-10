import React, { memo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import FormField from '@/components/FormField';
import IconButton from '@/components/IconButton';
import ProgressBar from '@/components/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, fonts, shadows } from '@/constants/theme';

interface ProjetoDetalheViewProps {
  isNewProject: boolean;
  name: string;
  subtitle: string;
  progress: number;
  isSaving: boolean;
  errorMessage: string | null;
  onNameChange: (text: string) => void;
  onSubtitleChange: (text: string) => void;
  onIncreaseProgress: () => void;
  onDecreaseProgress: () => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const ProjetoDetalheView: React.FC<ProjetoDetalheViewProps> = ({
  isNewProject,
  name,
  subtitle,
  progress,
  isSaving,
  errorMessage,
  onNameChange,
  onSubtitleChange,
  onIncreaseProgress,
  onDecreaseProgress,
  onSave,
  onDelete,
  onBack,
}) => (
  <PlanifyBackground>
    <AppHeader
      title={isNewProject ? 'Novo projeto' : 'Editar projeto'}
      subtitle='Construa o que você ama.'
      onBack={onBack}
      enableSecretAccess={false}
    />
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <FormField
          label='Nome do projeto'
          value={name}
          onChangeText={onNameChange}
          placeholder='Ex.: ScanSafe'
          autoFocus={isNewProject}
        />
        <FormField
          label='Descrição curta'
          value={subtitle}
          onChangeText={onSubtitleChange}
          placeholder='Ex.: App leitor de QR Code'
        />
        <Text style={styles.label}>Progresso</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <IconButton
              variant='square'
              onPress={onDecreaseProgress}
              accessibilityLabel='Diminuir progresso'
            >
              <Minus size={18} color={colors.text} />
            </IconButton>
            <Text style={styles.progressValue}>{progress}%</Text>
            <IconButton
              variant='square'
              onPress={onIncreaseProgress}
              accessibilityLabel='Aumentar progresso'
            >
              <Plus size={18} color={colors.text} />
            </IconButton>
          </View>
          <ProgressBar progress={progress} height={6} />
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <PrimaryButton
          label={isNewProject ? 'Criar projeto' : 'Salvar alterações'}
          onPress={onSave}
          loading={isSaving}
          style={styles.saveButton}
        />
        {!isNewProject ? (
          <PrimaryButton
            label='Excluir projeto'
            onPress={onDelete}
            variant='danger'
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    ...shadows.soft,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressValue: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontFamily: fonts.medium,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 6,
  },
});

export default memo(ProjetoDetalheView);

import React, { memo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import FormField from '@/components/FormField';
import ChipSelector from '@/components/ChipSelector';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, fonts } from '@/constants/theme';
import { taskCategoryOptions } from './model';

interface TarefaDetalheViewProps {
  isNewTask: boolean;
  title: string;
  category: string;
  dateText: string;
  timeText: string;
  completed: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onTitleChange: (text: string) => void;
  onCategoryChange: (text: string) => void;
  onDateChange: (text: string) => void;
  onTimeChange: (text: string) => void;
  onCompletedChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'done', label: 'Concluída' },
];

const TarefaDetalheView: React.FC<TarefaDetalheViewProps> = ({
  isNewTask,
  title,
  category,
  dateText,
  timeText,
  completed,
  isSaving,
  errorMessage,
  onTitleChange,
  onCategoryChange,
  onDateChange,
  onTimeChange,
  onCompletedChange,
  onSave,
  onDelete,
  onBack,
}) => (
  <PlanifyBackground>
    <AppHeader
      title={isNewTask ? 'Nova tarefa' : 'Editar tarefa'}
      subtitle='Um passo de cada vez.'
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
          label='Título'
          value={title}
          onChangeText={onTitleChange}
          placeholder='Ex.: Finalizar trabalho de JS'
          autoFocus={isNewTask}
        />
        <FormField
          label='Categoria'
          value={category}
          onChangeText={onCategoryChange}
          placeholder='Ex.: Faculdade'
        />
        <ChipSelector
          label='Sugestões'
          options={taskCategoryOptions}
          selected={category}
          onSelect={onCategoryChange}
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <FormField
              label='Data'
              value={dateText}
              onChangeText={onDateChange}
              placeholder='DD/MM/AAAA'
              keyboardType='number-pad'
            />
          </View>
          <View style={styles.timeColumn}>
            <FormField
              label='Hora'
              value={timeText}
              onChangeText={onTimeChange}
              placeholder='HH:MM'
              keyboardType='number-pad'
            />
          </View>
        </View>
        {!isNewTask ? (
          <ChipSelector
            label='Status'
            options={statusOptions}
            selected={completed ? 'done' : 'pending'}
            onSelect={onCompletedChange}
          />
        ) : null}
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <PrimaryButton
          label={isNewTask ? 'Criar tarefa' : 'Salvar alterações'}
          onPress={onSave}
          loading={isSaving}
          style={styles.saveButton}
        />
        {!isNewTask ? (
          <PrimaryButton
            label='Excluir tarefa'
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  timeColumn: {
    width: 120,
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

export default memo(TarefaDetalheView);

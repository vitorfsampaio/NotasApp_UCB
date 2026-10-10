import React, { memo, useMemo } from 'react';
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
import ChipSelector, { ChipOption } from '@/components/ChipSelector';
import PrimaryButton from '@/components/PrimaryButton';
import { eventIconOptions, eventIcons } from '@/constants/eventIcons';
import { colors, fonts } from '@/constants/theme';
import type { EventIcon } from '@/types';
import {
  durationOptions,
  eventCategoryOptions,
  reminderOptions,
} from './model';

interface EventoDetalheViewProps {
  isNewEvent: boolean;
  title: string;
  category: string;
  description: string;
  icon: EventIcon;
  dateText: string;
  timeText: string;
  durationMinutes: number;
  reminderMinutes: number | null;
  isSaving: boolean;
  errorMessage: string | null;
  onTitleChange: (text: string) => void;
  onCategoryChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onIconChange: (icon: EventIcon) => void;
  onDateChange: (text: string) => void;
  onTimeChange: (text: string) => void;
  onDurationChange: (minutes: number) => void;
  onReminderChange: (minutes: number | null) => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const EventoDetalheView: React.FC<EventoDetalheViewProps> = ({
  isNewEvent,
  title,
  category,
  description,
  icon,
  dateText,
  timeText,
  durationMinutes,
  reminderMinutes,
  isSaving,
  errorMessage,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onIconChange,
  onDateChange,
  onTimeChange,
  onDurationChange,
  onReminderChange,
  onSave,
  onDelete,
  onBack,
}) => {
  const iconOptions = useMemo<ChipOption<EventIcon>[]>(
    () =>
      eventIconOptions.map((option) => {
        const Icon = eventIcons[option];
        return {
          value: option,
          icon: (
            <Icon
              size={18}
              color={option === icon ? colors.text : colors.textSecondary}
            />
          ),
        };
      }),
    [icon]
  );

  return (
    <PlanifyBackground>
      <AppHeader
        title={isNewEvent ? 'Novo evento' : 'Editar evento'}
        subtitle='Planeje hoje. Construa amanhã.'
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
            placeholder='Ex.: Reunião de planejamento'
            autoFocus={isNewEvent}
          />
          <FormField
            label='Categoria'
            value={category}
            onChangeText={onCategoryChange}
            placeholder='Ex.: Equipe'
          />
          <ChipSelector
            label='Sugestões'
            options={eventCategoryOptions}
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
                label='Início'
                value={timeText}
                onChangeText={onTimeChange}
                placeholder='HH:MM'
                keyboardType='number-pad'
              />
            </View>
          </View>
          <ChipSelector
            label='Duração'
            options={durationOptions}
            selected={durationMinutes}
            onSelect={onDurationChange}
          />
          <ChipSelector
            label='Lembrete'
            options={reminderOptions}
            selected={reminderMinutes}
            onSelect={onReminderChange}
          />
          <ChipSelector
            label='Ícone'
            options={iconOptions}
            selected={icon}
            onSelect={onIconChange}
          />
          <FormField
            label='Descrição'
            value={description}
            onChangeText={onDescriptionChange}
            placeholder='Detalhes, pauta ou observações'
            multiline
          />
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
          <PrimaryButton
            label={isNewEvent ? 'Criar evento' : 'Salvar alterações'}
            onPress={onSave}
            loading={isSaving}
            style={styles.saveButton}
          />
          {!isNewEvent ? (
            <PrimaryButton
              label='Excluir evento'
              onPress={onDelete}
              variant='danger'
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </PlanifyBackground>
  );
};

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

export default memo(EventoDetalheView);

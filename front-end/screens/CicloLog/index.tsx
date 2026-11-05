import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import ChipSelector from '@/components/ChipSelector';
import FormField from '@/components/FormField';
import PlanifyBackground from '@/components/PlanifyBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { showErrorAlert } from '@/data/alerts';
import { useCycle } from '@/hooks/useCycle';
import { colors, fonts, radii } from '@/constants/theme';
import type { CycleFlow, CycleMood } from '@/domain/models';
import {
  FLOW_OPTIONS,
  formatIsoDate,
  MOOD_OPTIONS,
  SYMPTOM_OPTIONS,
} from '@/screens/Ciclo/model';

export default function CicloLogScreen() {
  const router = useRouter();
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
  const { getLogByDate, saveLog } = useCycle();
  const date = useMemo(
    () =>
      typeof dateParam === 'string' && dateParam.length >= 10
        ? dateParam.slice(0, 10)
        : formatIsoDate(new Date()),
    [dateParam]
  );
  const existing = getLogByDate(date);

  const [flow, setFlow] = useState<CycleFlow>(existing?.flow ?? '');
  const [mood, setMood] = useState<CycleMood>(existing?.mood ?? '');
  const [symptoms, setSymptoms] = useState<string[]>(existing?.symptoms ?? []);
  const [intimacy, setIntimacy] = useState(existing?.intimacy ?? false);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [saving, setSaving] = useState(false);

  const toggleSymptom = useCallback((symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveLog({
        date,
        flow,
        mood,
        symptoms,
        intimacy,
        notes,
      });
      router.back();
    } catch (error) {
      showErrorAlert(error, 'Não foi possível salvar o registro.');
    } finally {
      setSaving(false);
    }
  }, [date, flow, intimacy, mood, notes, router, saveLog, symptoms]);

  return (
    <PlanifyBackground>
      <AppHeader
        title='Como você se sente?'
        subtitle={date.split('-').reverse().join('/')}
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <ChipSelector
          label='Fluxo menstrual'
          options={FLOW_OPTIONS}
          selected={flow}
          onSelect={setFlow}
        />
        <ChipSelector
          label='Humor'
          options={MOOD_OPTIONS}
          selected={mood}
          onSelect={setMood}
        />
        <Text style={styles.label}>Sintomas</Text>
        <View style={styles.symptoms}>
          {SYMPTOM_OPTIONS.map((symptom) => {
            const selected = symptoms.includes(symptom);
            return (
              <TouchableOpacity
                key={symptom}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleSymptom(symptom)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {symptom}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Relação sexual</Text>
            <Text style={styles.switchHint}>
              Registre para acompanhar a janela fértil
            </Text>
          </View>
          <Switch
            value={intimacy}
            onValueChange={setIntimacy}
            trackColor={{ false: colors.border, true: colors.fertileMuted }}
            thumbColor={intimacy ? colors.fertile : colors.white}
          />
        </View>
        <FormField
          label='Anotações'
          value={notes}
          onChangeText={setNotes}
          placeholder='Opcional'
          multiline
        />
        <PrimaryButton
          label='Salvar registro'
          onPress={() => {
            void handleSave();
          }}
          loading={saving}
        />
      </ScrollView>
    </PlanifyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  symptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  chipSelected: {
    backgroundColor: colors.periodSoft,
    borderColor: colors.periodMuted,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: radii.card,
    backgroundColor: colors.fertileSoft,
  },
  switchCopy: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  switchHint: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});

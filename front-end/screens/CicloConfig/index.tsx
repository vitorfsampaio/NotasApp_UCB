import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import FormField from '@/components/FormField';
import PlanifyBackground from '@/components/PlanifyBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { showErrorAlert } from '@/data/alerts';
import { useCycle } from '@/hooks/useCycle';
import { colors, fonts } from '@/constants/theme';

function clamp(value: string, min: number, max: number, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

export default function CicloConfigScreen() {
  const router = useRouter();
  const { overview, saveSettings } = useCycle();
  const [cycleLength, setCycleLength] = useState(
    String(overview.settings.averageCycleLength)
  );
  const [periodLength, setPeriodLength] = useState(
    String(overview.settings.averagePeriodLength)
  );
  const [luteal, setLuteal] = useState(
    String(overview.settings.lutealPhaseLength)
  );
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveSettings({
        averageCycleLength: clamp(cycleLength, 21, 45, 28),
        averagePeriodLength: clamp(periodLength, 2, 10, 5),
        lutealPhaseLength: clamp(luteal, 10, 16, 14),
      });
      router.back();
    } catch (error) {
      showErrorAlert(error, 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }, [cycleLength, luteal, periodLength, router, saveSettings]);

  return (
    <PlanifyBackground>
      <AppHeader
        title='Configurações'
        subtitle='Personalize suas médias'
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.hint}>
          Essas médias alimentam a previsão do próximo ciclo e da janela fértil.
        </Text>
        <FormField
          label='Duração média do ciclo (dias)'
          value={cycleLength}
          onChangeText={setCycleLength}
          keyboardType='number-pad'
          placeholder='28'
        />
        <FormField
          label='Duração média da menstruação (dias)'
          value={periodLength}
          onChangeText={setPeriodLength}
          keyboardType='number-pad'
          placeholder='5'
        />
        <FormField
          label='Fase lútea (dias)'
          value={luteal}
          onChangeText={setLuteal}
          keyboardType='number-pad'
          placeholder='14'
        />
        <PrimaryButton
          label='Salvar'
          loading={saving}
          onPress={() => {
            void handleSave();
          }}
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
  hint: {
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});

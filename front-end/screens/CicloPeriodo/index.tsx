import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import AppHeader from '@/components/AppHeader';
import PlanifyBackground from '@/components/PlanifyBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { showErrorAlert } from '@/data/alerts';
import { formatDate, maskDateInput } from '@/data/dateUtils';
import { useCycle } from '@/hooks/useCycle';
import { colors, fonts, radii } from '@/constants/theme';
import { formatIsoDate } from '@/screens/Ciclo/model';

function parseBrToIso(dateText: string): string | null {
  const match = dateText.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const result = new Date(year, month, day);
  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month ||
    result.getDate() !== day
  ) {
    return null;
  }
  return formatIsoDate(result);
}

interface DateFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  placeholder,
  onChangeText,
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrap}>
      <CalendarDays size={18} color={colors.textSecondary} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(maskDateInput(text))}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.buttonSolid}
        keyboardType='number-pad'
        style={styles.input}
      />
    </View>
  </View>
);

export default function CicloPeriodoScreen() {
  const router = useRouter();
  const { addPeriod, overview, removePeriod } = useCycle();
  const [startDate, setStartDate] = useState(() => formatDate(new Date()));
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    const startIso = parseBrToIso(startDate);
    if (!startIso) {
      showErrorAlert(
        new Error('Use o formato DD/MM/AAAA na data de início.'),
        'Data inválida'
      );
      return;
    }
    let endIso: string | null = null;
    if (endDate.trim()) {
      endIso = parseBrToIso(endDate);
      if (!endIso) {
        showErrorAlert(
          new Error('Use o formato DD/MM/AAAA na data final.'),
          'Data inválida'
        );
        return;
      }
    }
    setSaving(true);
    try {
      await addPeriod({
        startDate: startIso,
        endDate: endIso,
      });
      router.back();
    } catch (error) {
      showErrorAlert(error, 'Não foi possível registrar.');
    } finally {
      setSaving(false);
    }
  }, [addPeriod, endDate, router, startDate]);

  return (
    <PlanifyBackground>
      <AppHeader
        title='Registrar período'
        subtitle='Início da menstruação'
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        <DateField
          label='Data de início'
          value={startDate}
          onChangeText={setStartDate}
          placeholder='DD/MM/AAAA'
        />
        <DateField
          label='Data final opcional'
          value={endDate}
          onChangeText={setEndDate}
          placeholder='Deixe vazio se ainda estiver menstruada'
        />
        <PrimaryButton
          label='Salvar período'
          loading={saving}
          onPress={() => {
            void handleSave();
          }}
        />

        {overview.periods.length > 0 ? (
          <View style={styles.history}>
            <Text style={styles.historyTitle}>Últimos períodos</Text>
            {overview.periods.slice(0, 6).map((period) => (
              <View key={period.id} style={styles.historyRow}>
                <View>
                  <Text style={styles.historyDate}>
                    {period.startDate.split('-').reverse().join('/')}
                    {period.endDate
                      ? ` → ${period.endDate.split('-').reverse().join('/')}`
                      : ' → em andamento'}
                  </Text>
                </View>
                <PrimaryButton
                  label='Remover'
                  variant='danger'
                  onPress={() => {
                    void removePeriod(period.id).catch((error) =>
                      showErrorAlert(error, 'Não foi possível remover.')
                    );
                  }}
                  style={styles.removeBtn}
                />
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </PlanifyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: radii.input,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: 12,
  },
  history: {
    marginTop: 28,
  },
  historyTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  historyDate: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  removeBtn: {
    height: 36,
    paddingHorizontal: 12,
  },
});

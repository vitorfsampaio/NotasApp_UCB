import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import PlanifyBackground from '@/components/PlanifyBackground';
import { useCycle } from '@/hooks/useCycle';
import { colors, fonts, radii } from '@/constants/theme';
import { formatShortPt, PHASE_LABELS } from '@/screens/Ciclo/model';

export default function CicloAnaliseScreen() {
  const router = useRouter();
  const { overview, logs } = useCycle();

  const intimacyCount = useMemo(
    () => logs.filter((log) => log.intimacy).length,
    [logs]
  );
  const symptomCount = useMemo(
    () => logs.filter((log) => log.symptoms.length > 0).length,
    [logs]
  );
  const flowDays = useMemo(
    () => logs.filter((log) => Boolean(log.flow)).length,
    [logs]
  );

  const topSymptoms = useMemo(() => {
    const counts = new Map<string, number>();
    logs.forEach((log) => {
      log.symptoms.forEach((symptom) => {
        counts.set(symptom, (counts.get(symptom) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [logs]);

  return (
    <PlanifyBackground>
      <AppHeader
        title='Análise'
        subtitle='Resumo do seu ciclo'
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fase atual</Text>
          <Text style={styles.cardValue}>{PHASE_LABELS[overview.phase]}</Text>
          <Text style={styles.cardHint}>
            {overview.currentCycleDay
              ? `Dia ${overview.currentCycleDay} de ${overview.cycleLength}`
              : 'Sem ciclo ativo'}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, styles.half]}>
            <Text style={styles.cardTitle}>Próxima menstruação</Text>
            <Text style={styles.cardValue}>
              {formatShortPt(overview.nextPeriodStart)}
            </Text>
          </View>
          <View style={[styles.card, styles.half]}>
            <Text style={styles.cardTitle}>Ovulação prevista</Text>
            <Text style={styles.cardValue}>
              {formatShortPt(overview.ovulationDate)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Janela fértil</Text>
          <Text style={styles.cardValue}>
            {overview.fertileWindowStart
              ? `${formatShortPt(overview.fertileWindowStart)} até ${formatShortPt(overview.fertileWindowEnd)}`
              : 'Registre um período para prever'}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.stat, styles.half]}>
            <Text style={styles.statValue}>{overview.periods.length}</Text>
            <Text style={styles.statLabel}>Ciclos registrados</Text>
          </View>
          <View style={[styles.stat, styles.half]}>
            <Text style={styles.statValue}>{intimacyCount}</Text>
            <Text style={styles.statLabel}>Relações anotadas</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.stat, styles.half]}>
            <Text style={styles.statValue}>{flowDays}</Text>
            <Text style={styles.statLabel}>Dias com fluxo</Text>
          </View>
          <View style={[styles.stat, styles.half]}>
            <Text style={styles.statValue}>{symptomCount}</Text>
            <Text style={styles.statLabel}>Dias com sintomas</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sintomas mais comuns</Text>
          {topSymptoms.length === 0 ? (
            <Text style={styles.cardHint}>Ainda sem sintomas registrados.</Text>
          ) : (
            topSymptoms.map(([name, count]) => (
              <View key={name} style={styles.symptomRow}>
                <Text style={styles.symptomName}>{name}</Text>
                <Text style={styles.symptomCount}>{count}x</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Médias usadas</Text>
          <Text style={styles.cardHint}>
            Ciclo de {overview.settings.averageCycleLength} dias · Menstruação
            de {overview.settings.averagePeriodLength} dias · Fase lútea de{' '}
            {overview.settings.lutealPhaseLength} dias
          </Text>
        </View>
      </ScrollView>
    </PlanifyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  cardHint: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  stat: {
    backgroundColor: colors.sageSoft,
    borderRadius: radii.card,
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  symptomName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  symptomCount: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.period,
  },
});

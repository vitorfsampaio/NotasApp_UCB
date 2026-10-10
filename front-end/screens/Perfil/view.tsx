import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import Avatar from '@/components/Avatar';
import HandwrittenNote from '@/components/HandwrittenNote';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, fonts, shadows } from '@/constants/theme';
import type { ProfileStat } from './model';

interface PerfilViewProps {
  fullName: string;
  username: string;
  preferences: string[];
  stats: ProfileStat[];
  onLogout: () => void;
}

const features = [
  'Tarefas do dia com check rápido',
  'Agenda semanal com lembretes',
  'Projetos com progresso',
  'Notas para suas ideias',
];

const PerfilView: React.FC<PerfilViewProps> = ({
  fullName,
  username,
  preferences,
  stats,
  onLogout,
}) => (
  <PlanifyBackground showLeaves>
    <AppHeader title='Perfil' subtitle='Sua jornada no Planify.' />
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <Avatar name={fullName} size={64} />
        <View style={styles.profileTexts}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.username}>@{username}</Text>
          {preferences.length > 0 ? (
            <View style={styles.preferences}>
              {preferences.map((item) => (
                <View key={item} style={styles.preference}>
                  <Text style={styles.preferenceText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Sobre o Planify</Text>
        <Text style={styles.aboutText}>
          Seu espaço de organização pessoal: tarefas, eventos, lembretes e
          projetos em um só lugar.
        </Text>
        {features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <PrimaryButton
        label='Sair da conta'
        variant='outline'
        onPress={onLogout}
      />

      <HandwrittenNote
        lines={['Melhor que', 'ontem']}
        accent='underline'
        rotation={-8}
        style={styles.note}
      />
    </ScrollView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 130,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  profileTexts: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  username: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  preference: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.sage,
  },
  preferenceText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  aboutCard: {
    marginTop: 14,
    marginBottom: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.sage,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  aboutText: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sageDot,
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  version: {
    marginTop: 10,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  note: {
    marginTop: 24,
    alignSelf: 'flex-end',
  },
});

export default memo(PerfilView);

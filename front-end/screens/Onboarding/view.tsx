import React, { memo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanifyBackground from '@/components/PlanifyBackground';
import HandwrittenNote from '@/components/HandwrittenNote';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, fonts } from '@/constants/theme';

interface OnboardingViewProps {
  onStart: () => void;
  loading?: boolean;
}

const highlights = ['Tarefas do dia', 'Agenda e lembretes', 'Projetos e notas'];

const OnboardingView: React.FC<OnboardingViewProps> = ({
  onStart,
  loading = false,
}) => (
  <PlanifyBackground showLeaves>
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.content}>
        <HandwrittenNote
          lines={['Pequenos passos', 'Grandes resultados']}
          accent='arrow'
        />
        <ImageBackground
          source={require('../../assets/images/week-mountains.jpg')}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <Text style={styles.heroBrand}>Planify</Text>
          <Text style={styles.heroText}>Planeje hoje. Construa amanhã.</Text>
        </ImageBackground>
        <View>
          <Text style={styles.title}>
            O Planify organiza{'\n'}o seu dia pra você
          </Text>
          <Text style={styles.subtitle}>
            Construa o que você ama. Um passo de cada vez.
          </Text>
          <View style={styles.highlights}>
            {highlights.map((item) => (
              <View key={item} style={styles.highlight}>
                <View style={styles.highlightDot} />
                <Text style={styles.highlightText}>{item}</Text>
              </View>
            ))}
          </View>
          <PrimaryButton label='Começar' onPress={onStart} loading={loading} />
        </View>
      </View>
    </SafeAreaView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  hero: {
    height: 260,
    justifyContent: 'flex-end',
    padding: 20,
    marginVertical: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 24, 21, 0.25)',
  },
  heroBrand: {
    fontSize: 40,
    fontFamily: fonts.handwrittenBold,
    color: colors.white,
  },
  heroText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.sage,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sageDot,
    marginRight: 6,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});

export default memo(OnboardingView);

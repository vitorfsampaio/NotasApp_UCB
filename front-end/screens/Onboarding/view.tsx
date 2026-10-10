import React, { memo } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors, fonts, radii, shadows } from '@/constants/theme';

interface OnboardingViewProps {
  onStart: () => void;
  loading?: boolean;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({
  onStart,
  loading = false,
}) => (
  <PlanifyBackground>
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Image
            source={require('../../assets/images/planify-welcome.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>O Planify resolve pra você!</Text>
        <Text style={styles.subtitle}>
          Afinal, ninguém te conhece melhor que a gente.
        </Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onStart}
          activeOpacity={0.88}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Começar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  heroCard: {
    width: '100%',
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 12,
    marginBottom: 24,
    ...shadows.soft,
  },
  illustration: {
    width: '100%',
    height: 280,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 36,
    maxWidth: 320,
  },
  button: {
    backgroundColor: colors.button,
    width: '100%',
    maxWidth: 280,
    height: 56,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.buttonBorder,
    ...shadows.button,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.3,
  },
});

export default memo(OnboardingView);

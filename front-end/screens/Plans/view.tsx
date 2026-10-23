import React, { memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanifyBackground from '@/components/PlanifyBackground';
import HandwrittenNote from '@/components/HandwrittenNote';
import PrimaryButton from '@/components/PrimaryButton';
import { planOptions } from '@/constants/plans';
import { colors, fonts, radii, shadows } from '@/constants/theme';
import type { SubscriptionPlan } from '@/domain/models';

interface PlansViewProps {
  selectedPlan: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onContinue: () => void;
  loading?: boolean;
  errorMessage?: string | null;
}

const PlansView: React.FC<PlansViewProps> = ({
  selectedPlan,
  onSelectPlan,
  onContinue,
  loading = false,
  errorMessage = null,
}) => (
  <PlanifyBackground showLeaves>
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HandwrittenNote
          lines={['Escolha o ritmo', 'do seu progresso']}
          accent='underline'
        />
        <Text style={styles.title}>Escolha seu plano</Text>
        <Text style={styles.subtitle}>
          A emergência está inclusa em todos. A diferença é o quanto o Planify
          organiza o seu dia.
        </Text>

        <View style={styles.list}>
          {planOptions.map((plan) => {
            const selected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => onSelectPlan(plan.id)}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitles}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planTagline}>{plan.tagline}</Text>
                  </View>
                  <View style={styles.priceBlock}>
                    {plan.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                </View>

                <View style={styles.features}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <View
                        style={[
                          styles.featureDot,
                          selected && styles.featureDotSelected,
                        ]}
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                  ]}
                >
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        <PrimaryButton
          label='Continuar'
          onPress={onContinue}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  title: {
    marginTop: 18,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  list: {
    gap: 14,
    marginBottom: 20,
  },
  card: {
    position: 'relative',
    padding: 18,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.soft,
  },
  cardSelected: {
    borderColor: colors.button,
    backgroundColor: colors.sageSoft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
    paddingRight: 28,
  },
  cardTitles: {
    flex: 1,
    minWidth: 0,
  },
  planName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
  },
  planTagline: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.sage,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.text,
  },
  planPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  features: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    backgroundColor: colors.sageDot,
  },
  featureDotSelected: {
    backgroundColor: colors.button,
  },
  featureText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  radio: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  radioSelected: {
    borderColor: colors.button,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.button,
  },
  error: {
    marginBottom: 12,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
  },
});

export default memo(PlansView);

import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radii, shadows } from '@/constants/theme';

type PrimaryButtonVariant = 'solid' | 'outline' | 'danger';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: PrimaryButtonVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid',
  style,
  testID,
}) => (
  <TouchableOpacity
    testID={testID}
    style={[
      styles.base,
      styles[variant],
      (disabled || loading) && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.88}
  >
    {loading ? (
      <ActivityIndicator
        color={variant === 'solid' ? colors.white : colors.text}
      />
    ) : (
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          variant === 'danger' && styles.dangerText,
        ]}
      >
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  solid: {
    backgroundColor: colors.button,
    ...shadows.button,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  danger: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  outlineText: {
    color: colors.text,
  },
  dangerText: {
    color: colors.error,
  },
});

export default memo(PrimaryButton);

import React, { memo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, shadows } from '@/constants/theme';

type IconButtonVariant = 'circle' | 'square' | 'plain';

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: IconButtonVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  variant = 'circle',
  style,
  testID,
  accessibilityLabel,
}) => (
  <TouchableOpacity
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole='button'
    onPress={onPress}
    activeOpacity={0.8}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    style={[styles.base, styles[variant], style]}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  square: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  plain: {
    width: 36,
    height: 36,
  },
});

export default memo(IconButton);

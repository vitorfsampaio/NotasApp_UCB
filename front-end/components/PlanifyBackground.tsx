import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';

interface PlanifyBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const PlanifyBackground: React.FC<PlanifyBackgroundProps> = ({
  children,
  style,
}) => (
  <View style={[styles.root, style]}>
    <View style={styles.ellipseLarge} />
    <View style={styles.ellipseSmall} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  ellipseLarge: {
    position: 'absolute',
    width: 280,
    height: 240,
    borderRadius: 140,
    backgroundColor: colors.ellipse,
    top: -40,
    left: -120,
  },
  ellipseSmall: {
    position: 'absolute',
    width: 260,
    height: 240,
    borderRadius: 130,
    backgroundColor: colors.ellipse,
    top: -110,
    left: 20,
  },
});

export default memo(PlanifyBackground);

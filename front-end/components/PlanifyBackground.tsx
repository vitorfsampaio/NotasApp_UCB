import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LeafDecoration from '@/components/LeafDecoration';
import { colors } from '@/constants/theme';

interface PlanifyBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showLeaves?: boolean;
}

const PlanifyBackground: React.FC<PlanifyBackgroundProps> = ({
  children,
  style,
  showLeaves = false,
}) => (
  <View style={[styles.root, style]}>
    {showLeaves ? <LeafDecoration style={styles.leaves} /> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  leaves: {
    position: 'absolute',
    left: -18,
    bottom: 40,
  },
});

export default memo(PlanifyBackground);

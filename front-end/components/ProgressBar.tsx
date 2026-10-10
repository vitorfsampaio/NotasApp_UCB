import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  trackColor?: string;
  fillColor?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  trackColor = colors.progressTrack,
  fillColor = colors.progressFill,
  height = 4,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <View
      style={[
        styles.track,
        { backgroundColor: trackColor, height, borderRadius: height },
      ]}
    >
      <View
        style={{
          width: `${clamped}%`,
          height,
          borderRadius: height,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default memo(ProgressBar);

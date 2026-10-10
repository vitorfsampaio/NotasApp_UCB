import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@/constants/theme';

type HandwrittenAccent = 'arrow' | 'underline' | 'smile' | 'none';

interface HandwrittenNoteProps {
  lines: string[];
  accent?: HandwrittenAccent;
  rotation?: number;
  style?: StyleProp<ViewStyle>;
}

const HandwrittenNote: React.FC<HandwrittenNoteProps> = ({
  lines,
  accent = 'none',
  rotation = -8,
  style,
}) => (
  <View
    style={[
      styles.container,
      { transform: [{ rotate: `${rotation}deg` }] },
      style,
    ]}
    pointerEvents='none'
  >
    <View style={styles.row}>
      <View>
        {lines.map((line) => (
          <Text key={line} style={styles.text}>
            {line}
          </Text>
        ))}
      </View>
      {accent === 'smile' ? (
        <Svg width={14} height={14} viewBox='0 0 14 14' style={styles.smile}>
          <Path
            d='M4 4 L4 5.5 M10 4 L10 5.5'
            stroke={colors.text}
            strokeWidth={1.3}
            strokeLinecap='round'
          />
          <Path
            d='M3 8.5 C 5 11, 9 11, 11 8.5'
            stroke={colors.text}
            strokeWidth={1.3}
            fill='none'
            strokeLinecap='round'
          />
        </Svg>
      ) : null}
    </View>
    {accent === 'arrow' ? (
      <Svg width={86} height={14} viewBox='0 0 86 14'>
        <Path
          d='M2 10 C 24 6, 52 4, 80 4'
          stroke={colors.text}
          strokeWidth={1.3}
          fill='none'
          strokeLinecap='round'
        />
        <Path
          d='M73 0.5 L81 4 L74 8'
          stroke={colors.text}
          strokeWidth={1.3}
          fill='none'
          strokeLinecap='round'
        />
      </Svg>
    ) : null}
    {accent === 'underline' || accent === 'smile' ? (
      <Svg width={72} height={8} viewBox='0 0 72 8'>
        <Path
          d='M2 6 C 22 2, 46 1, 70 3'
          stroke={colors.text}
          strokeWidth={1.3}
          fill='none'
          strokeLinecap='round'
        />
      </Svg>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: fonts.handwritten,
    fontSize: 17,
    lineHeight: 18,
    color: colors.text,
  },
  smile: {
    marginLeft: 4,
    marginTop: 2,
  },
});

export default memo(HandwrittenNote);

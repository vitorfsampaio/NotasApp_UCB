import React, { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface LeafDecorationProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
}

const LeafDecoration: React.FC<LeafDecorationProps> = ({
  style,
  size = 120,
}) => (
  <Svg
    width={size}
    height={size * 1.6}
    viewBox='0 0 100 160'
    style={style}
    pointerEvents='none'
  >
    <G opacity={0.55}>
      <Path
        d='M20 160 C 30 120, 40 90, 62 40'
        stroke='#9FB08F'
        strokeWidth={1.6}
        fill='none'
      />
      <Path
        d='M54 58 C 70 46, 86 46, 96 52 C 84 64, 68 68, 54 58 Z'
        fill='#B9C6AA'
      />
      <Path
        d='M46 78 C 30 66, 14 66, 4 72 C 16 86, 34 88, 46 78 Z'
        fill='#C7D2BA'
      />
      <Path
        d='M40 100 C 58 92, 74 96, 84 104 C 70 114, 52 114, 40 100 Z'
        fill='#AEBE9E'
      />
      <Path
        d='M33 122 C 18 112, 4 114, -4 120 C 8 132, 24 134, 33 122 Z'
        fill='#BCC9AE'
      />
      <Path
        d='M62 40 C 60 24, 66 10, 76 2 C 80 18, 74 32, 62 40 Z'
        fill='#A9BA98'
      />
    </G>
  </Svg>
);

export default memo(LeafDecoration);

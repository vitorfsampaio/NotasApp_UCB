import React, { memo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';

interface AuthHeroProps {
  tagline: string;
  highlights: string[];
  height?: number;
}

const AuthHero: React.FC<AuthHeroProps> = ({
  tagline,
  highlights,
  height = 220,
}) => (
  <ImageBackground
    source={require('../assets/images/week-mountains.jpg')}
    style={[styles.hero, { height }]}
    imageStyle={styles.heroImage}
  >
    <View style={styles.overlay} />
    <Text style={styles.brand}>Planify</Text>
    <View>
      <Text style={styles.tagline}>{tagline}</Text>
      <View style={styles.highlights}>
        {highlights.map((item) => (
          <View key={item} style={styles.highlight}>
            <View style={styles.highlightDot} />
            <Text style={styles.highlightText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  hero: {
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  brand: {
    fontSize: 34,
    fontFamily: fonts.handwrittenBold,
    color: colors.white,
  },
  tagline: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  highlightDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.sage,
    marginRight: 6,
  },
  highlightText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default memo(AuthHero);

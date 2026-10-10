import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors, fonts } from '@/constants/theme';

interface WelcomeViewProps {
  onStart: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => (
  <PlanifyBackground>
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/planify-welcome.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>O Planify resolve pra você!</Text>
        <Text style={styles.subtitle}>
          Afinal, ninguém te conhece melhor que a gente.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Começar</Text>
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
  illustration: {
    width: '100%',
    height: 320,
    marginBottom: 28,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 27,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 320,
  },
  button: {
    backgroundColor: colors.button,
    width: 232,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    color: colors.white,
  },
});

export default memo(WelcomeView);

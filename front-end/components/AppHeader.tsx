import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSecurity } from '../hooks/useSecurity';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const {
    authenticateForSecurityAccess,
    onHeaderSecretTap,
  } = useSecurity();

  const handleTitlePress = useCallback(() => {
    void onHeaderSecretTap();
  }, [onHeaderSecretTap]);

  const handleTitleLongPress = useCallback(() => {
    authenticateForSecurityAccess().then((success) => {
      if (success) {
        router.push('/seguranca');
      }
    });
  }, [authenticateForSecurityAccess, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <TouchableOpacity
          testID="e2e_sos_header"
          onPress={handleTitlePress}
          onLongPress={handleTitleLongPress}
          delayLongPress={650}
          activeOpacity={0.9}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    textDecorationLine: 'underline',
  },
});

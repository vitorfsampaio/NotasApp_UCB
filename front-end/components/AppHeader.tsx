import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSecurity } from '../hooks/useSecurity';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import IconButton from '@/components/IconButton';
import { colors, fonts } from '@/constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backTestID?: string;
  rightAction?: React.ReactNode;
  enableSecretAccess?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  onBack,
  backTestID,
  rightAction,
  enableSecretAccess = true,
}: AppHeaderProps) {
  const router = useRouter();
  const { authenticateForSecurityAccess, onHeaderSecretTap } = useSecurity();

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
      <View style={styles.container}>
        {onBack ? (
          <IconButton
            testID={backTestID}
            accessibilityLabel='Voltar'
            onPress={onBack}
            style={styles.backButton}
          >
            <ChevronLeft size={22} color={colors.text} />
          </IconButton>
        ) : null}
        <TouchableOpacity
          testID={enableSecretAccess ? 'e2e_sos_header' : undefined}
          onPress={enableSecretAccess ? handleTitlePress : undefined}
          onLongPress={enableSecretAccess ? handleTitleLongPress : undefined}
          delayLongPress={650}
          activeOpacity={1}
          style={styles.titleContainer}
        >
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </TouchableOpacity>
        {rightAction ? <View style={styles.right}>{rightAction}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  right: {
    marginLeft: 12,
  },
});

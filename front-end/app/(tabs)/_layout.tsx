import { Redirect, Tabs } from 'expo-router';
import { FileText, Home } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  const { token, isReady, onboardingCompleted } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href="/onboarding" />;
  }
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notas',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.text,
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 8,
    height: 60,
  },
});

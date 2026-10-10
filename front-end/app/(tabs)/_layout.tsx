import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import PlanifyTabBar from '@/components/PlanifyTabBar';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  const { token, isReady, onboardingCompleted } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href='/onboarding' />;
  }
  if (!onboardingCompleted) {
    return <Redirect href='/onboarding' />;
  }

  return (
    <Tabs
      tabBar={(props) => <PlanifyTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.background }}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='index' options={{ title: 'Início' }} />
      <Tabs.Screen name='agenda' options={{ title: 'Agenda' }} />
      <Tabs.Screen name='notas' options={{ title: 'Notas' }} />
      <Tabs.Screen name='perfil' options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

import { Redirect, Tabs } from 'expo-router';
import { FileText, Home } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0074D9',
        tabBarInactiveTintColor: '#888',
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
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E1E1E1',
    paddingTop: 6,
    paddingBottom: 8,
    height: 60,
  },
});
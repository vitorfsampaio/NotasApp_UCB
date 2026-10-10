import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  CalendarDays,
  FileText,
  House,
  LucideIcon,
  Plus,
  User,
} from 'lucide-react-native';
import QuickAddSheet, { QuickAddOption } from '@/components/QuickAddSheet';
import { colors, shadows } from '@/constants/theme';

const tabIcons: Record<string, LucideIcon> = {
  index: House,
  agenda: CalendarDays,
  notas: FileText,
  perfil: User,
};

const quickAddRoutes = {
  task: '/tarefa/nova',
  event: '/evento/novo',
  project: '/projeto/novo',
  note: '/nota/nova',
} as const;

const PlanifyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const openSheet = useCallback(() => setIsSheetVisible(true), []);
  const closeSheet = useCallback(() => setIsSheetVisible(false), []);
  const handleQuickAdd = useCallback(
    (option: QuickAddOption) => {
      router.push(quickAddRoutes[option]);
    },
    [router]
  );

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = tabIcons[route.name] ?? House;
          const { options } = descriptors[route.key];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.title}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <Icon
                size={20}
                color={isFocused ? colors.text : colors.tabInactive}
                strokeWidth={isFocused ? 2.2 : 1.8}
              />
              <View
                style={[styles.indicator, isFocused && styles.indicatorActive]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        testID='e2e_quick_add'
        accessibilityLabel='Adicionar'
        style={styles.fab}
        onPress={openSheet}
        activeOpacity={0.88}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
      <QuickAddSheet
        visible={isSheetVisible}
        onClose={closeSheet}
        onSelect={handleQuickAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 54,
    alignItems: 'center',
    marginRight: 14,
    ...shadows.soft,
  },
  tab: {
    width: 50,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    marginTop: 5,
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.text,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
});

export default memo(PlanifyTabBar);

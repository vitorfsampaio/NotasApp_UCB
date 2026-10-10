import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';
import type { Task } from '@/types';
import { formatTime } from '@/utils/dateUtils';
import { colors, fonts } from '@/constants/theme';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
  showDivider?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onPress,
  showDivider = true,
}) => {
  const handleToggle = useCallback(
    () => onToggle(task.id),
    [onToggle, task.id]
  );
  const handlePress = useCallback(() => onPress(task.id), [onPress, task.id]);
  const meta = [task.category, formatTime(task.dueAt)]
    .filter(Boolean)
    .join('  •  ');

  return (
    <View style={[styles.container, showDivider && styles.divider]}>
      <TouchableOpacity
        onPress={handleToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: task.completed }}
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
      >
        {task.completed ? (
          <Check size={13} color={colors.white} strokeWidth={3} />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.body}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.texts}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inputBorder,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  titleCompleted: {
    color: colors.textSecondary,
  },
  meta: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});

export default memo(TaskItem);

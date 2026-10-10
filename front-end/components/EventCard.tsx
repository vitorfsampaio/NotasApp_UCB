import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BellRing, ChevronRight } from 'lucide-react-native';
import type { PlannerEvent } from '@/types';
import { eventIcons } from '@/constants/eventIcons';
import { formatDuration, formatTime } from '@/utils/dateUtils';
import { colors, fonts, shadows } from '@/constants/theme';

interface EventCardProps {
  event: PlannerEvent;
  isHighlighted: boolean;
  isOngoing: boolean;
  onPress: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isHighlighted,
  isOngoing,
  onPress,
}) => {
  const handlePress = useCallback(() => onPress(event.id), [onPress, event.id]);
  const Icon = eventIcons[event.icon];
  const meta = [event.category, formatDuration(event.durationMinutes)]
    .filter(Boolean)
    .join('  •  ');

  return (
    <View style={styles.row}>
      <Text style={styles.time}>{formatTime(event.startsAt)}</Text>
      <TouchableOpacity
        style={[styles.card, isHighlighted && styles.cardHighlighted]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.header}>
          {isOngoing ? (
            <View style={styles.dot} />
          ) : (
            <View
              style={[
                styles.iconBox,
                isHighlighted && styles.iconBoxHighlighted,
              ]}
            >
              <Icon size={16} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta} numberOfLines={1}>
                {meta}
              </Text>
              {event.reminderMinutes !== null ? (
                <BellRing
                  size={11}
                  color={colors.textMuted}
                  style={styles.bell}
                />
              ) : null}
            </View>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>
        {isHighlighted && event.description ? (
          <View style={styles.description}>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  time: {
    width: 58,
    paddingTop: 4,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    ...shadows.soft,
  },
  cardHighlighted: {
    backgroundColor: colors.sage,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.sageDot,
    marginRight: 10,
    marginLeft: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxHighlighted: {
    backgroundColor: colors.sageSoft,
    borderColor: colors.sageStrong,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  meta: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  bell: {
    marginLeft: 6,
  },
  description: {
    marginTop: 12,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.sageSoft,
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});

export default memo(EventCard);

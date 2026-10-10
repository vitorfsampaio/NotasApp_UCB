import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  WEEKDAY_SHORT_NAMES,
  addDays,
  isSameDay,
  startOfWeek,
} from '@/utils/dateUtils';
import { colors, fonts } from '@/constants/theme';

interface WeekStripProps {
  selectedDate: Date;
  markedDates: Date[];
  onSelectDate: (date: Date) => void;
}

const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDate,
  markedDates,
  onSelectDate,
}) => {
  const days = useMemo(() => {
    const monday = startOfWeek(selectedDate);
    return WEEKDAY_SHORT_NAMES.map((label, offset) => ({
      label,
      date: addDays(monday, offset),
    }));
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      {days.map(({ label, date }) => {
        const isSelected = isSameDay(date, selectedDate);
        const hasItems = markedDates.some((marked) => isSameDay(marked, date));
        return (
          <TouchableOpacity
            key={label}
            style={[styles.day, isSelected && styles.daySelected]}
            onPress={() => onSelectDate(date)}
            activeOpacity={0.8}
          >
            <Text style={[styles.weekday, isSelected && styles.textSelected]}>
              {label}
            </Text>
            <Text style={[styles.number, isSelected && styles.textSelected]}>
              {date.getDate()}
            </Text>
            <View
              style={[
                styles.marker,
                hasItems && styles.markerVisible,
                hasItems && isSelected && styles.markerSelected,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 42,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 10,
  },
  daySelected: {
    backgroundColor: colors.button,
  },
  weekday: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  number: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  textSelected: {
    color: colors.white,
  },
  marker: {
    marginTop: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  markerVisible: {
    backgroundColor: colors.sageDot,
  },
  markerSelected: {
    backgroundColor: colors.sageStrong,
  },
});

export default memo(WeekStrip);

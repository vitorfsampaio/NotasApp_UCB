import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from 'react-native';
import {
  WEEKDAY_SHORT_NAMES,
  addDays,
  isSameDay,
  startOfDay,
} from '@/utils/dateUtils';
import { colors, fonts } from '@/constants/theme';

const DAY_WIDTH = 48;
const DAY_GAP = 6;
const ITEM_SIZE = DAY_WIDTH + DAY_GAP;

interface WeekStripProps {
  selectedDate: Date;
  markedDates: Date[];
  onSelectDate: (date: Date) => void;
  onVisibleMonthChange?: (year: number, month: number) => void;
}

function buildDayRange(anchor: Date): Date[] {
  const start = startOfDay(
    new Date(anchor.getFullYear(), anchor.getMonth() - 2, 1)
  );
  const end = startOfDay(
    new Date(anchor.getFullYear(), anchor.getMonth() + 3, 0)
  );
  const days: Date[] = [];
  let cursor = start;
  while (cursor.getTime() <= end.getTime()) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

function weekdayLabel(date: Date): string {
  const mondayBased = (date.getDay() + 6) % 7;
  return WEEKDAY_SHORT_NAMES[mondayBased];
}

const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDate,
  markedDates,
  onSelectDate,
  onVisibleMonthChange,
}) => {
  const listRef = useRef<FlatList<Date>>(null);
  const lastMonthKey = useRef('');
  const anchorYear = selectedDate.getFullYear();
  const anchorMonth = selectedDate.getMonth();

  const days = useMemo(
    () => buildDayRange(new Date(anchorYear, anchorMonth, 1)),
    [anchorYear, anchorMonth]
  );

  const selectedIndex = useMemo(() => {
    const index = days.findIndex((day) => isSameDay(day, selectedDate));
    return index >= 0 ? index : 0;
  }, [days, selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.35,
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [selectedIndex, anchorYear, anchorMonth]);

  const publishMonth = useCallback(
    (date: Date) => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (key === lastMonthKey.current) {
        return;
      }
      lastMonthKey.current = key;
      onVisibleMonthChange?.(date.getFullYear(), date.getMonth());
    },
    [onVisibleMonthChange]
  );

  useEffect(() => {
    publishMonth(selectedDate);
  }, [selectedDate, publishMonth]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((item) => item.isViewable && item.item);
      if (first?.item instanceof Date) {
        publishMonth(first.item);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.max(
        0,
        Math.min(days.length - 1, Math.round(offsetX / ITEM_SIZE))
      );
      const day = days[index];
      if (day) {
        publishMonth(day);
      }
    },
    [days, publishMonth]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Date>) => {
      const isSelected = isSameDay(item, selectedDate);
      const hasItems = markedDates.some((marked) => isSameDay(marked, item));
      return (
        <TouchableOpacity
          style={[styles.day, isSelected && styles.daySelected]}
          onPress={() => onSelectDate(startOfDay(item))}
          activeOpacity={0.8}
        >
          <Text style={[styles.weekday, isSelected && styles.textSelected]}>
            {weekdayLabel(item)}
          </Text>
          <Text style={[styles.number, isSelected && styles.textSelected]}>
            {item.getDate()}
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
    },
    [markedDates, onSelectDate, selectedDate]
  );

  const keyExtractor = useCallback(
    (item: Date) =>
      `${item.getFullYear()}-${item.getMonth()}-${item.getDate()}`,
    []
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Date> | null | undefined, index: number) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      ref={listRef}
      data={days}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      decelerationRate='fast'
      snapToInterval={ITEM_SIZE}
      snapToAlignment='start'
      contentContainerStyle={styles.content}
      getItemLayout={getItemLayout}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: info.index,
            animated: true,
            viewPosition: 0.35,
          });
        }, 80);
      }}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 2,
  },
  day: {
    width: DAY_WIDTH,
    marginRight: DAY_GAP,
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

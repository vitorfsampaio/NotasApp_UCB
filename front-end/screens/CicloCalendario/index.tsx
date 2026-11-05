import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import AppHeader from '@/components/AppHeader';
import PlanifyBackground from '@/components/PlanifyBackground';
import { MONTH_NAMES, WEEKDAY_SHORT_NAMES } from '@/data/dateUtils';
import { useCycle } from '@/hooks/useCycle';
import { colors, fonts, radii } from '@/constants/theme';
import { formatIsoDate } from '@/screens/Ciclo/model';

function buildMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export default function CicloCalendarioScreen() {
  const router = useRouter();
  const { overview, logs, getLogByDate } = useCycle();
  const now = new Date();
  const [cursor, setCursor] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );

  const cells = useMemo(
    () => buildMonthDays(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const periodSet = useMemo(() => {
    const set = new Set<string>();
    overview.periods.forEach((period) => {
      const start = new Date(`${period.startDate}T12:00:00`);
      const end = period.endDate
        ? new Date(`${period.endDate}T12:00:00`)
        : new Date(start.getTime() + (overview.periodLength - 1) * 86400000);
      for (
        let current = new Date(start);
        current <= end;
        current.setDate(current.getDate() + 1)
      ) {
        set.add(formatIsoDate(current));
      }
    });
    return set;
  }, [overview.periods, overview.periodLength]);

  const fertileSet = useMemo(() => {
    const set = new Set<string>();
    if (!overview.fertileWindowStart || !overview.fertileWindowEnd) {
      return set;
    }
    const start = new Date(`${overview.fertileWindowStart}T12:00:00`);
    const end = new Date(`${overview.fertileWindowEnd}T12:00:00`);
    for (
      let current = new Date(start);
      current <= end;
      current.setDate(current.getDate() + 1)
    ) {
      set.add(formatIsoDate(current));
    }
    return set;
  }, [overview.fertileWindowStart, overview.fertileWindowEnd]);

  const intimacySet = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.intimacy) {
        set.add(log.date);
      }
    });
    return set;
  }, [logs]);

  return (
    <PlanifyBackground>
      <AppHeader
        title='Calendário'
        subtitle='Ciclo, fertilidade e registros'
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <View style={styles.monthRow}>
          <TouchableOpacity
            onPress={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
            hitSlop={12}
          >
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
            hitSlop={12}
          >
            <ChevronRight size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {WEEKDAY_SHORT_NAMES.map((name) => (
            <Text key={name} style={styles.weekLabel}>
              {name}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((cell, index) => {
            if (!cell) {
              return <View key={`empty-${index}`} style={styles.cell} />;
            }
            const iso = formatIsoDate(cell);
            const isToday = iso === formatIsoDate(now);
            const isPeriod = periodSet.has(iso);
            const isFertile = fertileSet.has(iso);
            const hasLog = Boolean(getLogByDate(iso));
            const hasIntimacy = intimacySet.has(iso);
            return (
              <TouchableOpacity
                key={iso}
                style={[
                  styles.cell,
                  isPeriod && styles.periodCell,
                  isFertile && !isPeriod && styles.fertileCell,
                  isToday && styles.todayCell,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/ciclo/log',
                    params: { date: iso },
                  })
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dayText,
                    (isPeriod || isFertile) && styles.dayTextStrong,
                  ]}
                >
                  {cell.getDate()}
                </Text>
                <View style={styles.dots}>
                  {hasLog ? <View style={styles.dotMood} /> : null}
                  {hasIntimacy ? <View style={styles.dotHeart} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.periodSoft }]} />
            <Text style={styles.legendText}>Menstruação</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.fertileSoft }]} />
            <Text style={styles.legendText}>Fértil</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.moodWarm }]} />
            <Text style={styles.legendText}>Registro</Text>
          </View>
        </View>
      </View>
    </PlanifyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.input,
    marginBottom: 4,
  },
  periodCell: {
    backgroundColor: colors.periodSoft,
  },
  fertileCell: {
    backgroundColor: colors.fertileSoft,
  },
  todayCell: {
    borderWidth: 1.5,
    borderColor: colors.button,
  },
  dayText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  dayTextStrong: {
    color: colors.text,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    minHeight: 6,
  },
  dotMood: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.moodWarm,
  },
  dotHeart: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.fertile,
  },
  legend: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});

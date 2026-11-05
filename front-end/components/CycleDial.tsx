import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { Droplet } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';
import type { CycleDailyLog, CycleOverview } from '@/domain/models';

interface CycleDialProps {
  overview: CycleOverview;
  logs: CycleDailyLog[];
  cycleDay: number;
  dateLabel: string;
  headline: string;
  phaseLabel: string;
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 112;
const STROKE = 18;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDay: number,
  endDay: number,
  totalDays: number
) {
  if (endDay < startDay) {
    return '';
  }
  const startAngle = ((startDay - 1) / totalDays) * 360;
  const endAngle = (endDay / totalDays) * 360;
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function dayToAngle(day: number, totalDays: number) {
  return ((day - 1) / totalDays) * 360;
}

const CycleDial: React.FC<CycleDialProps> = ({
  overview,
  logs,
  cycleDay,
  dateLabel,
  headline,
  phaseLabel,
}) => {
  const cycleLength = Math.max(21, overview.cycleLength || 28);
  const periodLength = Math.max(1, overview.periodLength || 5);
  const luteal = Math.max(10, overview.settings.lutealPhaseLength || 14);
  const markerDay = Math.max(1, Math.min(cycleLength, cycleDay || 1));

  const ranges = useMemo(() => {
    if (!overview.predictionReady) {
      return null;
    }
    const ovulationDay = Math.max(1, cycleLength - luteal);
    const fertileStart = Math.max(1, ovulationDay - 5);
    const fertileEnd = Math.min(cycleLength, ovulationDay + 1);
    const preStart = periodLength + 1;
    const preEnd = Math.max(preStart - 1, fertileStart - 1);
    return {
      periodEnd: periodLength,
      preStart,
      preEnd,
      fertileStart,
      fertileEnd,
      ovulationDay,
    };
  }, [overview.predictionReady, cycleLength, luteal, periodLength]);

  const dots = useMemo(() => {
    if (!overview.currentCycleStart) {
      return [];
    }
    const cycleStart = new Date(`${overview.currentCycleStart}T12:00:00`);
    return logs
      .map((log) => {
        const logDate = new Date(`${log.date}T12:00:00`);
        const day =
          Math.floor(
            (logDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        if (day < 1 || day > cycleLength) {
          return null;
        }
        let color = colors.sageDot;
        if (log.flow) {
          color = colors.period;
        } else if (log.intimacy) {
          color = colors.fertile;
        } else if (log.mood) {
          color = colors.moodWarm;
        }
        const angle = dayToAngle(day, cycleLength);
        const point = polar(CENTER, CENTER, RADIUS - 28, angle);
        return { id: log.id, x: point.x, y: point.y, color };
      })
      .filter(Boolean) as { id: string; x: number; y: number; color: string }[];
  }, [logs, overview.currentCycleStart, cycleLength]);

  const dayMarker = polar(
    CENTER,
    CENTER,
    RADIUS,
    dayToAngle(markerDay, cycleLength)
  );

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={colors.cycleRing}
          strokeWidth={STROKE}
          fill='none'
          strokeDasharray='3 9'
          strokeLinecap='round'
        />
        {ranges ? (
          <>
            <Path
              d={arcPath(
                CENTER,
                CENTER,
                RADIUS,
                1,
                ranges.periodEnd,
                cycleLength
              )}
              stroke={colors.period}
              strokeWidth={STROKE}
              fill='none'
              strokeLinecap='round'
            />
            {ranges.preEnd >= ranges.preStart ? (
              <Path
                d={arcPath(
                  CENTER,
                  CENTER,
                  RADIUS,
                  ranges.preStart,
                  ranges.preEnd,
                  cycleLength
                )}
                stroke={colors.preOvulation}
                strokeWidth={STROKE}
                fill='none'
                strokeLinecap='round'
              />
            ) : null}
            <Path
              d={arcPath(
                CENTER,
                CENTER,
                RADIUS,
                ranges.fertileStart,
                ranges.fertileEnd,
                cycleLength
              )}
              stroke={colors.fertile}
              strokeWidth={STROKE}
              fill='none'
              strokeLinecap='round'
            />
            <Path
              d={arcPath(
                CENTER,
                CENTER,
                RADIUS,
                ranges.ovulationDay,
                ranges.ovulationDay,
                cycleLength
              )}
              stroke={colors.ovulation}
              strokeWidth={STROKE + 2}
              fill='none'
              strokeLinecap='round'
            />
          </>
        ) : null}
        <G>
          {dots.map((dot) => (
            <Circle
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              r={4}
              fill={dot.color}
            />
          ))}
        </G>
        <Circle
          cx={dayMarker.x}
          cy={dayMarker.y}
          r={24}
          fill={colors.white}
          stroke={colors.border}
          strokeWidth={1}
        />
      </Svg>
      {overview.predictionReady ? (
        <View
          style={[
            styles.periodIcon,
            {
              left:
                polar(CENTER, CENTER, RADIUS, dayToAngle(1, cycleLength)).x -
                10,
              top:
                polar(CENTER, CENTER, RADIUS, dayToAngle(1, cycleLength)).y -
                10,
            },
          ]}
        >
          <Droplet size={14} color={colors.period} fill={colors.period} />
        </View>
      ) : null}
      <View
        style={[
          styles.dayBadge,
          {
            left: dayMarker.x - 28,
            top: dayMarker.y - 10,
          },
        ]}
        pointerEvents='none'
      >
        <Text style={styles.dayBadgeText}>Dia {markerDay}</Text>
      </View>
      <View style={styles.center} pointerEvents='none'>
        <Text style={styles.phase}>{phaseLabel}</Text>
        <Text style={styles.dayTitle}>Dia {markerDay}</Text>
        <Text style={styles.today}>{dateLabel}</Text>
        <Text style={styles.headline}>{headline}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    width: 168,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  phase: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.period,
    marginBottom: 2,
  },
  dayTitle: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  today: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  headline: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
  },
  dayBadge: {
    position: 'absolute',
    width: 56,
    alignItems: 'center',
  },
  dayBadgeText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  periodIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(CycleDial);

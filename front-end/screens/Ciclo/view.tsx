import React, { memo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CalendarDays,
  ChevronRight,
  Heart,
  HeartPulse,
  Settings2,
  Smile,
} from 'lucide-react-native';
import AppHeader from '@/components/AppHeader';
import CycleDial from '@/components/CycleDial';
import HandwrittenNote from '@/components/HandwrittenNote';
import IconButton from '@/components/IconButton';
import PlanifyBackground from '@/components/PlanifyBackground';
import WeekStrip from '@/components/WeekStrip';
import { colors, fonts, radii, shadows } from '@/constants/theme';
import {
  CYCLE_LEGEND,
  formatShortPt,
  type CycleDailyLog,
  type CycleDayStatus,
  type CycleOverview,
} from './model';

interface CicloViewProps {
  overview: CycleOverview;
  logs: CycleDailyLog[];
  dayStatus: CycleDayStatus;
  selectedDate: Date;
  monthLabel: string;
  markedDates: Date[];
  hasIntimacy: boolean;
  isSavingIntimacy: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectDate: (date: Date) => void;
  onVisibleMonthChange: (year: number, month: number) => void;
  onToggleIntimacy: () => void;
  onOpenLog: () => void;
  onOpenCalendar: () => void;
  onOpenAnalysis: () => void;
  onOpenSettings: () => void;
  onRegisterPeriod: () => void;
}

const CicloView: React.FC<CicloViewProps> = ({
  overview,
  logs,
  dayStatus,
  selectedDate,
  monthLabel,
  markedDates,
  hasIntimacy,
  isSavingIntimacy,
  isLoading,
  onRefresh,
  onSelectDate,
  onVisibleMonthChange,
  onToggleIntimacy,
  onOpenLog,
  onOpenCalendar,
  onOpenAnalysis,
  onOpenSettings,
  onRegisterPeriod,
}) => (
  <PlanifyBackground showLeaves>
    <AppHeader
      title='Seu ciclo atual'
      subtitle={dayStatus.phaseLabel}
      rightAction={
        <IconButton
          variant='square'
          onPress={onOpenSettings}
          accessibilityLabel='Configurações do ciclo'
        >
          <Settings2 size={18} color={colors.text} />
        </IconButton>
      }
    />
    {isLoading && !overview.predictionReady && overview.periods.length === 0 ? (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color={colors.buttonSolid} />
      </View>
    ) : (
      <>
        <View style={styles.calendarBlock}>
          <View style={styles.monthRow}>
            <Text style={styles.month}>{monthLabel}</Text>
            <HandwrittenNote
              lines={['Cuide de', 'você']}
              accent='smile'
              rotation={-8}
            />
          </View>
          <WeekStrip
            selectedDate={selectedDate}
            markedDates={markedDates}
            onSelectDate={onSelectDate}
            onVisibleMonthChange={onVisibleMonthChange}
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              tintColor={colors.buttonSolid}
            />
          }
        >
          <CycleDial
            overview={overview}
            logs={logs}
            cycleDay={dayStatus.cycleDay ?? 1}
            dateLabel={dayStatus.dateLabel}
            headline={dayStatus.headline}
            phaseLabel={dayStatus.phaseLabel}
          />

          <View style={styles.legend}>
            {CYCLE_LEGEND.map((item) => (
              <View key={item.key} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Detalhes do período</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fase</Text>
              <Text style={styles.detailValue}>{dayStatus.phaseLabel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dia do ciclo</Text>
              <Text style={styles.detailValue}>
                {dayStatus.cycleDay
                  ? `${dayStatus.cycleDay} de ${overview.cycleLength}`
                  : '—'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Próxima menstruação</Text>
              <Text style={styles.detailValue}>
                {dayStatus.daysUntilNextPeriod === null
                  ? '—'
                  : dayStatus.daysUntilNextPeriod === 0
                    ? 'Hoje'
                    : `em ${dayStatus.daysUntilNextPeriod} dia${dayStatus.daysUntilNextPeriod === 1 ? '' : 's'}`}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ovulação prevista</Text>
              <Text style={styles.detailValue}>
                {formatShortPt(dayStatus.ovulationDate)}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Janela fértil</Text>
              <Text style={styles.detailValue}>
                {dayStatus.fertileWindowStart
                  ? `${formatShortPt(dayStatus.fertileWindowStart)} – ${formatShortPt(dayStatus.fertileWindowEnd)}`
                  : '—'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.intimacyCard,
              hasIntimacy && styles.intimacyCardActive,
            ]}
            onPress={onToggleIntimacy}
            activeOpacity={0.88}
            disabled={isSavingIntimacy}
          >
            <View
              style={[
                styles.feelIcon,
                hasIntimacy && styles.intimacyIconActive,
              ]}
            >
              <Heart
                size={18}
                color={hasIntimacy ? colors.white : colors.period}
                fill={hasIntimacy ? colors.white : 'transparent'}
              />
            </View>
            <View style={styles.intimacyCopy}>
              <Text style={styles.feelText}>
                {hasIntimacy
                  ? 'Relação registrada neste dia'
                  : 'Registrar relação sexual'}
              </Text>
              <Text style={styles.intimacyHint}>
                Toque para {hasIntimacy ? 'remover' : 'marcar'} no dia
                selecionado
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.feelCard}
            onPress={onOpenLog}
            activeOpacity={0.88}
          >
            <View style={styles.feelIcon}>
              <Smile size={20} color={colors.text} />
            </View>
            <Text style={styles.feelText}>Como você se sente neste dia?</Text>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.infoCard}
              onPress={onOpenCalendar}
              activeOpacity={0.88}
            >
              <CalendarDays size={18} color={colors.fertile} />
              <Text style={styles.infoLabel}>Próximo período</Text>
              <Text style={styles.infoValue}>
                {formatShortPt(dayStatus.nextPeriodStart)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoCard}
              onPress={onOpenAnalysis}
              activeOpacity={0.88}
            >
              <HeartPulse size={18} color={colors.period} />
              <Text style={styles.infoLabel}>Janela fértil</Text>
              <Text style={styles.infoValue}>
                {dayStatus.fertileWindowStart
                  ? `${formatShortPt(dayStatus.fertileWindowStart)} – ${formatShortPt(dayStatus.fertileWindowEnd)}`
                  : '—'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.periodBtn}
            onPress={onRegisterPeriod}
            activeOpacity={0.88}
          >
            <Text style={styles.periodBtnText}>Registrar menstruação</Text>
          </TouchableOpacity>

          <HandwrittenNote
            lines={['Com calma', 'e carinho']}
            accent='underline'
            rotation={-10}
            style={styles.bottomNote}
          />
        </ScrollView>
      </>
    )}
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  calendarBlock: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  month: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 140,
    paddingTop: 4,
  },
  bottomNote: {
    marginTop: 28,
    alignSelf: 'flex-start',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    marginTop: 4,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    gap: 12,
  },
  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  intimacyCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.fertileSoft,
    borderRadius: radii.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  intimacyCardActive: {
    backgroundColor: colors.periodSoft,
  },
  intimacyIconActive: {
    backgroundColor: colors.period,
  },
  intimacyCopy: {
    flex: 1,
  },
  intimacyHint: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  feelCard: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.periodSoft,
    borderRadius: radii.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  feelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feelText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  grid: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  periodBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  periodBtnText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
});

export default memo(CicloView);

import React, { memo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CalendarCheck, CalendarDays, ChevronDown } from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import IconButton from '@/components/IconButton';
import HandwrittenNote from '@/components/HandwrittenNote';
import WeekStrip from '@/components/WeekStrip';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import MonthPickerModal from '@/components/MonthPickerModal';
import { colors, fonts } from '@/constants/theme';
import type { PlannerEvent } from './model';

interface AgendaViewProps {
  monthLabel: string;
  selectedDate: Date;
  markedDates: Date[];
  dayEvents: PlannerEvent[];
  highlightedEventId: string | null;
  ongoingEventId: string | null;
  isLoading: boolean;
  isMonthPickerVisible: boolean;
  onRefresh: () => void;
  onBack: () => void;
  onGoToToday: () => void;
  onOpenMonthPicker: () => void;
  onCloseMonthPicker: () => void;
  onSelectMonth: (year: number, month: number) => void;
  onSelectDate: (date: Date) => void;
  onEventPress: (id: string) => void;
  onCreateEvent: () => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({
  monthLabel,
  selectedDate,
  markedDates,
  dayEvents,
  highlightedEventId,
  ongoingEventId,
  isLoading,
  isMonthPickerVisible,
  onRefresh,
  onBack,
  onGoToToday,
  onOpenMonthPicker,
  onCloseMonthPicker,
  onSelectMonth,
  onSelectDate,
  onEventPress,
  onCreateEvent,
}) => (
  <PlanifyBackground showLeaves>
    <AppHeader
      title='Agenda'
      subtitle='Planeje hoje. Construa amanhã.'
      onBack={onBack}
      rightAction={
        <IconButton
          variant='square'
          onPress={onGoToToday}
          accessibilityLabel='Ir para hoje'
        >
          <CalendarDays size={19} color={colors.text} />
        </IconButton>
      }
    />
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.buttonSolid}
        />
      }
    >
      <View style={styles.monthRow}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={onOpenMonthPicker}
          activeOpacity={0.7}
        >
          <Text style={styles.month}>{monthLabel}</Text>
          <ChevronDown size={18} color={colors.text} />
        </TouchableOpacity>
        <HandwrittenNote lines={['Bom', 'dia']} accent='smile' rotation={-8} />
      </View>

      <WeekStrip
        selectedDate={selectedDate}
        markedDates={markedDates}
        onSelectDate={onSelectDate}
      />

      <View style={styles.timeline}>
        {dayEvents.length === 0 ? (
          <View>
            <EmptyState
              icon={<CalendarCheck size={20} color={colors.textSecondary} />}
              title='Nada marcado neste dia'
              subtitle='Aproveite para descansar ou adicione um novo evento.'
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={onCreateEvent}
              activeOpacity={0.88}
            >
              <Text style={styles.addButtonText}>Adicionar evento</Text>
            </TouchableOpacity>
          </View>
        ) : (
          dayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isHighlighted={event.id === highlightedEventId}
              isOngoing={event.id === ongoingEventId}
              onPress={onEventPress}
            />
          ))
        )}
      </View>
    </ScrollView>
    <MonthPickerModal
      visible={isMonthPickerVisible}
      selectedDate={selectedDate}
      onClose={onCloseMonthPicker}
      onSelectMonth={onSelectMonth}
    />
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 130,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  month: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  timeline: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.inputBorder,
  },
  addButton: {
    marginTop: 14,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.button,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});

export default memo(AgendaView);

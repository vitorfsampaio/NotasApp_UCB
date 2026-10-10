import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { MONTH_NAMES } from '@/utils/dateUtils';
import { colors, fonts } from '@/constants/theme';

interface MonthPickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectMonth: (year: number, month: number) => void;
}

const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  visible,
  selectedDate,
  onClose,
  onSelectMonth,
}) => {
  const [year, setYear] = useState(selectedDate.getFullYear());

  useEffect(() => {
    if (visible) {
      setYear(selectedDate.getFullYear());
    }
  }, [visible, selectedDate]);

  const goToPreviousYear = useCallback(() => setYear((prev) => prev - 1), []);
  const goToNextYear = useCallback(() => setYear((prev) => prev + 1), []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={goToPreviousYear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.year}>{year}</Text>
            <TouchableOpacity
              onPress={goToNextYear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {MONTH_NAMES.map((name, month) => {
              const isSelected =
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear();
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.month, isSelected && styles.monthSelected]}
                  onPress={() => onSelectMonth(year, month)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.monthText,
                      isSelected && styles.monthTextSelected,
                    ]}
                  >
                    {name.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  year: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  month: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  monthSelected: {
    backgroundColor: colors.button,
  },
  monthText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  monthTextSelected: {
    color: colors.white,
  },
});

export default memo(MonthPickerModal);

import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';

export interface ChipOption<T extends string | number | null> {
  value: T;
  label?: string;
  icon?: React.ReactNode;
}

interface ChipSelectorProps<T extends string | number | null> {
  label: string;
  options: ChipOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

function ChipSelector<T extends string | number | null>({
  label,
  options,
  selected,
  onSelect,
}: ChipSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.chip,
                option.icon && !option.label ? styles.iconChip : null,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.8}
              accessibilityState={{ selected: isSelected }}
            >
              {option.icon ?? null}
              {option.label ? (
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  iconChip: {
    width: 42,
    height: 42,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 12,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.sage,
    borderColor: colors.sageStrong,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.text,
  },
});

export default memo(ChipSelector) as typeof ChipSelector;

import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fonts, radii } from '@/constants/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  style,
  multiline,
  ...inputProps
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...inputProps}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor={colors.textMuted}
      selectionColor={colors.buttonSolid}
      style={[styles.input, multiline && styles.multiline, style]}
    />
  </View>
);

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
  input: {
    minHeight: 50,
    borderRadius: radii.input,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  multiline: {
    minHeight: 110,
    paddingTop: 14,
    paddingBottom: 14,
  },
});

export default memo(FormField);

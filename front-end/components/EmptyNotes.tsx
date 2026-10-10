import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FilePlus } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';

export default function EmptyNotes() {
  return (
    <View style={styles.container}>
      <FilePlus size={48} color={colors.textMuted} />
      <Text style={styles.title}>Sem notas</Text>
      <Text style={styles.subtitle}>
        Toque no botão + para criar uma nova nota
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

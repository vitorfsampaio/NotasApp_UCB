import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Note } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { colors, fonts } from '@/constants/theme';

interface NoteItemProps {
  note: Note;
  index?: number;
}

export default function NoteItem({ note }: NoteItemProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/nota/${note.id}`);
  }, [router, note.id]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={4}>
          {note.content}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.accentBar} />
        <Text style={styles.date}>{getRelativeTime(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 7,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  top: {
    backgroundColor: colors.backgroundSoft,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    minHeight: 140,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 10,
  },
  preview: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accentBar: {
    width: 88,
    height: 10,
    borderRadius: 4,
    backgroundColor: colors.cardAccent,
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.tabInactive,
  },
});

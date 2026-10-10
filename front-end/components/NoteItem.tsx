import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Note } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { colors, fonts, shadows } from '@/constants/theme';

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
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <ChevronRight size={18} color={colors.textMuted} />
      </View>
      {note.content ? (
        <Text style={styles.preview} numberOfLines={3}>
          {note.content}
        </Text>
      ) : null}
      <View style={styles.footer}>
        <View style={styles.dot} />
        <Text style={styles.date}>{getRelativeTime(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  preview: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sageDot,
    marginRight: 6,
  },
  date: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
});

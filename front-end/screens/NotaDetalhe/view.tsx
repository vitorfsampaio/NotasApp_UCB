import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Plus } from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors, fonts } from '@/constants/theme';

interface NotaDetalheViewProps {
  title: string;
  content: string;
  isNewNote: boolean;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onBack: () => void | Promise<void>;
  onDelete?: () => void;
  onAddNote?: () => void | Promise<void>;
}

const NotaDetalheView: React.FC<NotaDetalheViewProps> = ({
  title,
  content,
  isNewNote,
  onTitleChange,
  onContentChange,
  onBack,
  onDelete,
  onAddNote,
}) => (
  <PlanifyBackground>
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isNewNote ? 'Nova Nota' : 'Editar Nota'}
          </Text>
          {isNewNote ? (
            <TouchableOpacity
              onPress={onAddNote}
              style={styles.addButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Plus size={26} color={colors.white} />
            </TouchableOpacity>
          ) : onDelete ? (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Trash2 size={22} color={colors.error} />
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={onTitleChange}
            placeholder="Título da nota"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.buttonSolid}
            autoFocus={isNewNote}
          />
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={onContentChange}
            placeholder={isNewNote ? 'Digite sua nota...' : 'Edite sua nota...'}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.buttonSolid}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </SafeAreaView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.buttonSolid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  spacer: { width: 44 },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});

export default NotaDetalheView;

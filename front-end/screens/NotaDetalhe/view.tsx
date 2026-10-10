import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import IconButton from '@/components/IconButton';
import { colors, fonts, shadows } from '@/constants/theme';

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
    <AppHeader
      title={isNewNote ? 'Nova nota' : 'Editar nota'}
      subtitle='Salva automaticamente ao voltar.'
      onBack={onBack}
      enableSecretAccess={false}
      rightAction={
        isNewNote ? (
          <IconButton
            variant='square'
            onPress={onAddNote}
            accessibilityLabel='Salvar nota'
          >
            <Check size={19} color={colors.text} />
          </IconButton>
        ) : onDelete ? (
          <IconButton
            variant='square'
            onPress={onDelete}
            accessibilityLabel='Excluir nota'
          >
            <Trash2 size={18} color={colors.error} />
          </IconButton>
        ) : null
      }
    />
    <View style={styles.form}>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={onTitleChange}
        placeholder='Título da nota'
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
        textAlignVertical='top'
      />
    </View>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    ...shadows.soft,
  },
  contentInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    textAlignVertical: 'top',
    marginBottom: 28,
    ...shadows.soft,
  },
});

export default NotaDetalheView;

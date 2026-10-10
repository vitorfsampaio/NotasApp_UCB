import React, { memo, useCallback } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CalendarPlus,
  ChevronRight,
  FolderKanban,
  ListTodo,
  StickyNote,
} from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';

export type QuickAddOption = 'task' | 'event' | 'project' | 'note';

interface QuickAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: QuickAddOption) => void;
}

const options = [
  {
    key: 'task',
    label: 'Nova tarefa',
    description: 'Algo para concluir hoje ou depois',
    Icon: ListTodo,
  },
  {
    key: 'event',
    label: 'Novo evento',
    description: 'Compromisso na agenda com lembrete',
    Icon: CalendarPlus,
  },
  {
    key: 'project',
    label: 'Novo projeto',
    description: 'Acompanhe o progresso de algo maior',
    Icon: FolderKanban,
  },
  {
    key: 'note',
    label: 'Nova nota',
    description: 'Anote uma ideia rápida',
    Icon: StickyNote,
  },
] as const;

const QuickAddSheet: React.FC<QuickAddSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();
  const handleSelect = useCallback(
    (option: QuickAddOption) => {
      onClose();
      onSelect(option);
    },
    [onClose, onSelect]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>O que vamos planejar?</Text>
          {options.map(({ key, label, description, Icon }) => (
            <TouchableOpacity
              key={key}
              style={styles.option}
              onPress={() => handleSelect(key)}
              activeOpacity={0.8}
            >
              <View style={styles.iconBox}>
                <Icon size={18} color={colors.text} />
              </View>
              <View style={styles.texts}>
                <Text style={styles.optionLabel}>{label}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  texts: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  optionDescription: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});

export default memo(QuickAddSheet);

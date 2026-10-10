import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { SecurityContact } from '@/types';
import PlanifyBackground from '@/components/PlanifyBackground';
import IconButton from '@/components/IconButton';
import { colors, fonts, shadows } from '@/constants/theme';

interface SegurancaViewProps {
  safetyKeyword: string;
  setSafetyKeyword: (text: string) => void;
  contacts: SecurityContact[];
  sendLocationEnabled: boolean;
  setSendLocationEnabled: (value: boolean) => void;
  makeCallEnabled: boolean;
  setMakeCallEnabled: (value: boolean) => void;
  newContactName: string;
  setNewContactName: (text: string) => void;
  newContactPhone: string;
  setNewContactPhone: (text: string) => void;
  showAddContact: boolean;
  setShowAddContact: (show: boolean) => void;
  handleAddContact: () => void;
  handleRemoveContact: (id: string) => void;
  onBack: () => void;
  saveSecuritySettings: () => void;
}

const SegurancaView: React.FC<SegurancaViewProps> = ({
  safetyKeyword,
  setSafetyKeyword,
  contacts,
  sendLocationEnabled,
  setSendLocationEnabled,
  makeCallEnabled,
  setMakeCallEnabled,
  newContactName,
  setNewContactName,
  newContactPhone,
  setNewContactPhone,
  showAddContact,
  setShowAddContact,
  handleAddContact,
  handleRemoveContact,
  onBack,
  saveSecuritySettings,
}) => {
  // Máscara: sempre começa com +55
  const maskedPhone = useMemo(() => {
    if (newContactPhone.startsWith('+55')) return newContactPhone;
    // Remove qualquer + ou espaço do início
    let digits = newContactPhone.replace(/^\+?55?/, '');
    // Remove caracteres não numéricos
    digits = digits.replace(/\D/g, '');
    return '+55' + digits;
  }, [newContactPhone]);

  const handlePhoneChange = (text: string) => {
    // Remove qualquer + ou espaço do início
    let digits = text.replace(/^\+?55?/, '');
    // Remove caracteres não numéricos
    digits = digits.replace(/\D/g, '');
    setNewContactPhone('+55' + digits);
  };

  return (
    <PlanifyBackground>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              testID='e2e_seguranca_back'
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel='Voltar'
            >
              <ChevronLeft size={22} color={colors.text} />
            </IconButton>
            <Text style={styles.headerTitle}>Configurações de Segurança</Text>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Palavra-chave de Segurança
              </Text>
              <Text style={styles.sectionDescription}>
                Quando esta palavra for digitada em uma nota, o sistema de
                emergência será ativado silenciosamente.
              </Text>
              <TextInput
                style={styles.keywordInput}
                value={safetyKeyword}
                onChangeText={setSafetyKeyword}
                placeholder='Digite a palavra-chave'
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.buttonSolid}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ações de Emergência</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>Enviar localização</Text>
                  <Text style={styles.toggleDescription}>
                    Enviar SMS com sua localização para os contatos abaixo
                  </Text>
                </View>
                <Switch
                  value={sendLocationEnabled}
                  onValueChange={setSendLocationEnabled}
                  trackColor={{
                    false: colors.progressTrack,
                    true: colors.sageStrong,
                  }}
                  thumbColor={
                    sendLocationEnabled ? colors.button : colors.surface
                  }
                />
              </View>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleLabel}>Ligação automática</Text>
                  <Text style={styles.toggleDescription}>
                    Realizar chamada automática para o primeiro contato da lista
                  </Text>
                </View>
                <Switch
                  value={makeCallEnabled}
                  onValueChange={setMakeCallEnabled}
                  trackColor={{
                    false: colors.progressTrack,
                    true: colors.sageStrong,
                  }}
                  thumbColor={makeCallEnabled ? colors.button : colors.surface}
                />
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.contactsHeader}>
                <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
                <TouchableOpacity
                  testID='e2e_seguranca_add_contact'
                  style={styles.addContactButton}
                  onPress={() => setShowAddContact(!showAddContact)}
                >
                  <Plus size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              {showAddContact && (
                <Animated.View style={styles.addContactContainer}>
                  <TextInput
                    testID='e2e_contact_name'
                    style={styles.contactInput}
                    value={newContactName}
                    onChangeText={setNewContactName}
                    placeholder='Nome do contato'
                    placeholderTextColor={colors.textMuted}
                  />
                  <TextInput
                    testID='e2e_contact_phone'
                    style={styles.contactInput}
                    value={maskedPhone}
                    onChangeText={handlePhoneChange}
                    placeholder='Telefone com DDD'
                    placeholderTextColor={colors.textMuted}
                    keyboardType='phone-pad'
                  />
                  <TouchableOpacity
                    testID='e2e_contact_save'
                    style={styles.saveContactButton}
                    onPress={handleAddContact}
                  >
                    <Text style={styles.saveContactButtonText}>Adicionar</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
              {contacts.length === 0 ? (
                <Text style={styles.emptyContactsText}>
                  Nenhum contato adicionado. Adicione contatos para receber
                  alertas em caso de emergência.
                </Text>
              ) : (
                contacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                    <View style={styles.contactActions}>
                      <TouchableOpacity
                        style={styles.contactActionButton}
                        onPress={() => handleRemoveContact(contact.id)}
                      >
                        <Trash2 size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
            <Text style={styles.securityNote}>
              Suas informações são armazenadas apenas neste dispositivo e de
              forma criptografada.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </PlanifyBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: { marginRight: 16 },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  content: { padding: 20, paddingBottom: 48 },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  keywordInput: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  toggleTextContainer: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.text },
  toggleDescription: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addContactButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sageSoft,
  },
  addContactContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  contactInput: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 8,
  },
  saveContactButton: {
    backgroundColor: colors.button,
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveContactButtonText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  emptyContactsText: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  contactInfo: {},
  contactName: { fontFamily: fonts.semiBold, color: colors.text, fontSize: 14 },
  contactPhone: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontSize: 13,
  },
  contactActions: { flexDirection: 'row' },
  contactActionButton: { padding: 8 },
  securityNote: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SegurancaView;

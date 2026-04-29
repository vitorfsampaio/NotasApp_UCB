import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { SecurityContact } from '@/types';

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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="e2e_seguranca_back"
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#0074D9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações de Segurança</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Palavra-chave de Segurança</Text>
            <Text style={styles.sectionDescription}>
              Quando esta palavra for digitada em uma nota, o sistema de emergência será ativado silenciosamente.
            </Text>
            <TextInput
              style={styles.keywordInput}
              value={safetyKeyword}
              onChangeText={setSafetyKeyword}
              placeholder="Digite a palavra-chave"
              placeholderTextColor="#9E9E9E"
              selectionColor="#0074D9"
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
                trackColor={{ false: "#DEDEDE", true: "#A4C9F0" }}
                thumbColor={sendLocationEnabled ? "#0074D9" : "#F5F5F5"}
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
                trackColor={{ false: "#DEDEDE", true: "#A4C9F0" }}
                thumbColor={makeCallEnabled ? "#0074D9" : "#F5F5F5"}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.contactsHeader}>
              <Text style={styles.sectionTitle}>Contatos de Emergência</Text>
              <TouchableOpacity
                testID="e2e_seguranca_add_contact"
                style={styles.addContactButton}
                onPress={() => setShowAddContact(!showAddContact)}
              >
                <Plus size={20} color="#0074D9" />
              </TouchableOpacity>
            </View>
            {showAddContact && (
              <Animated.View style={styles.addContactContainer}>
                <TextInput
                  testID="e2e_contact_name"
                  style={styles.contactInput}
                  value={newContactName}
                  onChangeText={setNewContactName}
                  placeholder="Nome do contato"
                  placeholderTextColor="#9E9E9E"
                />
                <TextInput
                  testID="e2e_contact_phone"
                  style={styles.contactInput}
                  value={maskedPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="Telefone com DDD"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  testID="e2e_contact_save"
                  style={styles.saveContactButton}
                  onPress={handleAddContact}
                >
                  <Text style={styles.saveContactButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {contacts.length === 0 ? (
              <Text style={styles.emptyContactsText}>
                Nenhum contato adicionado. Adicione contatos para receber alertas em caso de emergência.
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
                      <Trash2 size={18} color="#FF4136" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
          <Text style={styles.securityNote}>
            Suas informações são armazenadas apenas neste dispositivo e de forma criptografada.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0074D9', marginLeft: 16 },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0074D9', marginBottom: 8 },
  sectionDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  keywordInput: { borderWidth: 1, borderColor: '#DEDEDE', borderRadius: 8, padding: 8, fontSize: 16, color: '#333' },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  toggleTextContainer: { flex: 1 },
  toggleLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  toggleDescription: { fontSize: 12, color: '#666' },
  contactsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  addContactButton: { padding: 8 },
  addContactContainer: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginBottom: 12 },
  contactInput: { borderWidth: 1, borderColor: '#DEDEDE', borderRadius: 8, padding: 8, fontSize: 16, color: '#333', marginBottom: 8 },
  saveContactButton: { backgroundColor: '#0074D9', borderRadius: 8, padding: 10, alignItems: 'center' },
  saveContactButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContactsText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 8 },
  contactItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginBottom: 8 },
  contactInfo: {},
  contactName: { fontWeight: 'bold', color: '#333', fontSize: 16 },
  contactPhone: { color: '#666', fontSize: 14 },
  contactActions: { flexDirection: 'row' },
  contactActionButton: { padding: 8 },
  securityNote: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 16 },
});

export default SegurancaView; 
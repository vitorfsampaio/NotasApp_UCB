import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors, fonts } from '@/constants/theme';

interface SobreViewProps {
  onLogout: () => void;
}

const SobreView: React.FC<SobreViewProps> = ({ onLogout }) => (
  <PlanifyBackground>
    <AppHeader title="Sobre!" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Planify</Text>
      <Text style={styles.version}>Versão 1.0.0</Text>
      <Image
        source={require('../../assets/images/planify-welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.description}>
        Um aplicativo simples para criar e gerenciar suas anotações pessoais.
        Organize suas ideias, listas de compras, tarefas e pensamentos em um só
        lugar.
      </Text>
      <Text style={styles.sectionTitle}>Funcionalidades</Text>
      <Text style={styles.bullet}>• Crie notas ilimitadas</Text>
      <Text style={styles.bullet}>• Edite e exclua anotações</Text>
      <Text style={styles.bullet}>• Interface simples e intuitiva</Text>
      <Text style={styles.bullet}>• Conta protegida por login</Text>
      <Text style={styles.bullet}>• Design Planify</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        © 2026 Planify. Todos os direitos reservados.
      </Text>
    </ScrollView>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  image: { width: '100%', height: 180, marginBottom: 16 },
  description: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    marginLeft: 8,
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 36,
    backgroundColor: colors.button,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.buttonBorder,
  },
  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 32,
    textAlign: 'center',
  },
});

export default SobreView;

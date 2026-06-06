import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatMemberSince(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    navigation?.setOptions?.({ tabBarLabel: 'Perfil' });
  }, [navigation]);

  function confirmLogout() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: handleLogout },
      ],
      { cancelable: true }
    );
  }

  async function handleLogout() {
    try {
      setBusy(true);
      await logout();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const initials = getInitials(user?.nome);
  const memberSince = formatMemberSince(user?.createdAt);
  const firstName = user?.nome?.split(' ')[0] || '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#0A1120', '#0F172A', '#14213D']}
          style={styles.hero}
        >
          <View style={styles.heroInner}>
            <View style={styles.avatarRing}>
              <LinearGradient
                colors={[colors.success, colors.info]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGrad}
              >
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.heroGreeting}>
              {firstName ? `Olá, ${firstName}` : 'Olá!'}
            </Text>
            <Text style={styles.heroTitle}>Meu Perfil</Text>
            <Text style={styles.heroSubtitle}>
              Gerencie sua conta e sessão
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { background: `${colors.secondary}1A`, borderColor: `${colors.secondary}33` }]}>
                <Ionicons name="person-outline" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.cardTitle}>Informações da conta</Text>
            </View>

            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="person-circle-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.infoLabel}>Nome</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {user?.nome || '—'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.infoLabel}>E-mail</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {user?.email || '—'}
                </Text>
              </View>

              {memberSince ? (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoLeft}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                      <Text style={styles.infoLabel}>Membro desde</Text>
                    </View>
                    <Text style={styles.infoValue}>{memberSince}</Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { background: `${colors.warning}1A`, borderColor: `${colors.warning}33` }]}>
                <Ionicons name="settings-outline" size={18} color={colors.warning} />
              </View>
              <Text style={styles.cardTitle}>Acesso rápido</Text>
            </View>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation?.navigate?.('About')}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIcon, { background: `${colors.info}1A` }]}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.info} />
                </View>
                <Text style={styles.actionLabel}>Sobre o EcoSense</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation?.navigate?.('Dashboard', { screen: 'Dashboard' })}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIcon, { background: `${colors.success}1A` }]}>
                  <Ionicons name="grid-outline" size={16} color={colors.success} />
                </View>
                <Text style={styles.actionLabel}>Ir para o Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.logoutBtn, busy && styles.logoutBtnBusy]}
            onPress={confirmLogout}
            disabled={busy}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>
              {busy ? 'Saindo...' : 'Sair da conta'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              P.I 4º Semestre — EcoSense — Monitoramento inteligente para um futuro sustentável
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },

  hero: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 20,
    position: 'relative',
  },
  heroInner: { alignItems: 'center' },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    marginBottom: 16,
  },
  avatarGrad: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  heroGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  infoList: { gap: 0 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    marginTop: 6,
  },
  logoutBtnBusy: { opacity: 0.6 },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: colors.textInactive,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

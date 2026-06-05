import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

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
            <View style={styles.badge}>
              <View style={styles.dot} />
              <Text style={styles.badgeText}>Plataforma IoT de Monitoramento</Text>
            </View>

            <Text style={styles.heroTitle}>
              Eficiência Energética em{'\n'}
              <Text style={styles.heroGradient}>tempo real</Text>
            </Text>

            <Text style={styles.heroSub}>
              Monitore o consumo de energia da sua residência ou empresa com
              sensores IoT inteligentes.
            </Text>

            {user?.nome ? (
              <Text style={styles.welcome}>Olá, {user.nome.split(' ')[0]}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.cta}
              onPress={() => navigation?.navigate('Dashboard')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#23C55E', '#1EA34D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="grid-outline" size={18} color="#FFFFFF" />
                <Text style={styles.ctaText}>Acessar Dashboard</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.ctaDesc}>
              Acompanhe métricas energéticas em tempo real
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            EcoSense © {new Date().getFullYear()} — Monitoramento Inteligente de Energia
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'space-between' },
  hero: {
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 24,
  },
  heroInner: { alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.secondary}1F`,
    borderWidth: 1,
    borderColor: `${colors.secondary}40`,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondary,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 14,
  },
  heroGradient: { color: colors.primary },
  heroSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  cta: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.textInactive,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const DESTAQUES = [
  {
    icon: 'pulse-outline',
    color: colors.success,
    bg: 'rgba(34,197,94,0.08)',
    title: 'Monitoramento em Tempo Real',
    text: 'Dados atualizados instantaneamente dos seus equipamentos via sensores IoT.',
  },
  {
    icon: 'bar-chart-outline',
    color: colors.secondary,
    bg: 'rgba(59,130,246,0.08)',
    title: 'Análise de Consumo',
    text: 'Gráficos e relatórios detalhados para entender padrões de uso e economia.',
  },
  {
    icon: 'alert-circle-outline',
    color: colors.warning,
    bg: 'rgba(245,158,11,0.08)',
    title: 'Alertas Inteligentes',
    text: 'Notificações automáticas para consumo anormal, picos de energia e falhas.',
  },
  {
    icon: 'leaf-outline',
    color: colors.info,
    bg: 'rgba(6,182,212,0.08)',
    title: 'Economia de Energia',
    text: 'Recomendações personalizadas para otimizar o consumo e reduzir custos.',
  },
];

const MOCKUP_STATS = [
  { label: 'Consumo Atual', value: '2.4', unit: 'kW', trend: 'down', trendText: '12%' },
  { label: 'Economia Hoje', value: 'R$ 3,80', unit: '', trend: 'up', trendText: 'economia' },
  { label: 'Dispositivos', value: '8', unit: '', trend: 'info', trendText: 'online' },
  { label: 'Alertas Hoje', value: '2', unit: '', trend: 'warn', trendText: '1 pendente' },
];

const DEVICES = [
  { name: 'Geladeira', value: '450W', fill: 0.65, color: colors.success },
  { name: 'Micro-ondas', value: '120W', fill: 0.35, color: colors.warning },
  { name: 'Ventilador', value: '75W', fill: 0.2, color: colors.info },
];

function SectionDivider() {
  return <View style={styles.divider} />;
}

function HighlightIcon({ name, color, bg }) {
  return (
    <View style={[styles.cardIcon, { backgroundColor: bg }]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

function MockupBrowser() {
  return (
    <View style={styles.mockupFrame}>
      <View style={styles.mockupHeader}>
        <View style={styles.mockupDots}>
          <View style={[styles.dot, { background: '#EF4444' }]} />
          <View style={[styles.dot, { background: '#F59E0B' }]} />
          <View style={[styles.dot, { background: '#22C55E' }]} />
        </View>
        <Text style={styles.mockupLabel}>EcoSense — Dashboard</Text>
      </View>

      <View style={styles.mockupBody}>
        <View style={styles.mockupStats}>
          {MOCKUP_STATS.map((s, i) => (
            <View key={i} style={styles.mockupStat}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>{s.value}</Text>
                {s.unit ? <Text style={styles.statUnit}>{s.unit}</Text> : null}
              </View>
              <Text
                style={[
                  styles.statBadge,
                  s.trend === 'down' && { color: colors.success },
                  s.trend === 'up' && { color: colors.success },
                  s.trend === 'info' && { color: colors.info },
                  s.trend === 'warn' && { color: colors.warning },
                ]}
              >
                {s.trendText}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.mockupChartArea}>
          <View style={styles.chartGrid} />
          <View style={styles.chartLine} />
        </View>

        <View style={styles.mockupDevices}>
          {DEVICES.map((d, i) => (
            <View key={i} style={styles.deviceRow}>
              <Text style={styles.deviceName}>{d.name}</Text>
              <View style={styles.deviceBarBg}>
                <View
                  style={[
                    styles.deviceBarFill,
                    { width: `${d.fill * 100}%`, backgroundColor: d.color },
                  ]}
                />
              </View>
              <Text style={styles.deviceValue}>{d.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

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
            <View style={styles.heroTag}>
              <View style={styles.heroTagDot} />
              <Text style={styles.heroTagText}>Plataforma IoT de Monitoramento</Text>
            </View>

            <Text style={styles.heroTitle}>
              Economia de energia em{'\n'}
              <Text style={styles.heroGradient}>tempo real</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Acompanhe o consumo de energia dos seus equipamentos com sensores
              IoT. Receba alertas inteligentes, analise dados precisos e reduza
              desperdícios.
            </Text>

            {user?.nome ? (
              <Text style={styles.welcome}>Olá, {user.nome.split(' ')[0]}</Text>
            ) : null}

            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation?.navigate?.('Dashboard', { screen: 'Dashboard' })}
                activeOpacity={0.85}
              >
                <Ionicons name="grid-outline" size={18} color="#0F172A" />
                <Text style={styles.btnPrimaryText}>Explorar Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => navigation?.navigate?.('About')}
                activeOpacity={0.85}
              >
                <Ionicons name="information-circle-outline" size={18} color={colors.textPrimary} />
                <Text style={styles.btnSecondaryText}>Saiba Mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.destaques}>
          <Text style={styles.sectionTitle}>Por que EcoSense?</Text>
          <Text style={styles.sectionSubtitle}>
            Uma plataforma completa para transformar dados energéticos em
            decisões inteligentes
          </Text>

          <View style={styles.destaquesGrid}>
            {DESTAQUES.map((d, i) => (
              <View key={i} style={styles.destaqueCard}>
                <HighlightIcon name={d.icon} color={d.color} bg={d.bg} />
                <Text style={styles.cardTitle}>{d.title}</Text>
                <Text style={styles.cardText}>{d.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionDivider />

        <View style={styles.mockup}>
          <Text style={styles.sectionTitle}>Visualize seus dados</Text>
          <Text style={styles.sectionSubtitle}>
            Dashboard completo com todas as informações que você precisa
          </Text>
          <MockupBrowser />
        </View>

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
  scrollContent: { paddingBottom: 32 },

  hero: {
    paddingTop: 32,
    paddingBottom: 56,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroInner: { alignItems: 'center' },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(34,197,94,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
    marginBottom: 20,
  },
  heroTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.6,
    marginBottom: 14,
  },
  heroGradient: {
    color: colors.success,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 320,
  },
  welcome: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  btnPrimary: {
    flex: 1,
    maxWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.success,
  },
  btnPrimaryText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  btnSecondary: {
    flex: 1,
    maxWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  destaques: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 56,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 320,
    alignSelf: 'center',
  },
  destaquesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  destaqueCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
  },
  cardText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    marginHorizontal: 40,
    backgroundColor: colors.border,
    opacity: 0.4,
  },

  mockup: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 48,
  },
  mockupFrame: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(30,41,59,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51,65,85,0.3)',
  },
  mockupDots: { flexDirection: 'row', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  mockupLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  mockupBody: { padding: 14 },
  mockupStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  mockupStat: {
    width: (width - 76) / 2,
    backgroundColor: 'rgba(30,41,59,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.25)',
    borderRadius: 10,
    padding: 10,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statBadge: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  mockupChartArea: {
    height: 100,
    backgroundColor: 'rgba(30,41,59,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderColor: 'rgba(51,65,85,0.15)',
    borderTopWidth: 1,
  },
  chartLine: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: colors.success,
    borderRadius: 1,
    transform: [{ scaleY: 1 }],
    shadowColor: colors.success,
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  mockupDevices: {
    gap: 8,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deviceName: {
    width: 80,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  deviceBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(51,65,85,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  deviceBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  deviceValue: {
    width: 40,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
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

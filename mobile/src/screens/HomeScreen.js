import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import PulseDot from '../components/PulseDot';
import InfoCard from '../components/InfoCard';
import StatusBadge from '../components/StatusBadge';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const isSmall = width < 380;
const cardWidth = (width - 52) / 2;

function PressScaleButton({ children, onPress, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const whyCards = [
  {
    icon: '\u26A1',
    color: colors.primary,
    bg: colors.successBg,
    title: 'Monitoramento em Tempo Real',
    desc: 'Acompanhe o consumo de energia el\u00e9trica instantaneamente com dados atualizados a cada segundo.',
  },
  {
    icon: '\uD83D\uDCCA',
    color: colors.secondary,
    bg: colors.secondaryBg,
    title: 'An\u00e1lise de Consumo',
    desc: 'Visualize gr\u00e1ficos detalhados e relat\u00f3rios inteligentes sobre o uso de energia.',
  },
  {
    icon: '\uD83D\uDD14',
    color: colors.warning,
    bg: colors.warningBg,
    title: 'Alertas Inteligentes',
    desc: 'Receba notifica\u00e7\u00f5es quando o consumo ultrapassar limites pr\u00e9-definidos.',
  },
  {
    icon: '\uD83C\uDF31',
    color: colors.purple,
    bg: colors.purpleBg,
    title: 'Efici\u00eancia Energ\u00e9tica',
    desc: 'Identifique desperd\u00edcios e receba sugest\u00f5es para reduzir sua conta de luz.',
  },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="light" />

        {/* ===== HERO ===== */}
        <LinearGradient colors={['#0A1120', '#0F172A', '#14213D']} style={s.heroWrap}>
          <FadeInView style={s.heroInner}>
            <Image
              source={require('../../assets/logo.png')}
              style={s.heroLogo}
              resizeMode="contain"
            />

            <View style={s.badge}>
              <PulseDot />
              <Text style={s.badgeText}>Plataforma IoT de Monitoramento</Text>
            </View>

            <Text style={s.heroTitle}>
              Efici\u00eancia Energ\u00e9tica em{'\n'}
              <Text style={s.heroGradient}>tempo real</Text>
            </Text>

            <Text style={s.heroSub}>
              Monitore o consumo de energia da sua resid\u00eancia ou empresa com sensores IoT inteligentes.
            </Text>

            {/* CTA Button */}
            <PressScaleButton onPress={() => navigation?.navigate('Dashboard')}>
              <LinearGradient
                colors={['#23C55E', '#1EA34D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.ctaButton}
              >
                <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
                <Text style={s.ctaButtonText}>Explorar Dashboard</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </PressScaleButton>
            <Text style={s.ctaDesc}>Acompanhe m\u00e9tricas energ\u00e9ticas em tempo real</Text>
          </FadeInView>

          {/* MONITORING PANEL */}
          <FadeInView delay={300} style={s.panel}>
            <View style={s.panelGlow} pointerEvents="none" />
            <Text style={s.panelTitle}>Monitoramento ao Vivo</Text>

            <View style={s.metricsGrid}>
              <FadeInView delay={400} style={{ width: cardWidth }}>
                <InfoCard
                  icon="flash"
                  iconColor={colors.warning}
                  bgColor={colors.warningBg}
                  label="Consumo Atual"
                  value="3.2 kWh"
                  subtitle={'\u2191 12% que ontem'}
                  subtitleColor={colors.danger}
                />
              </FadeInView>
              <FadeInView delay={460} style={{ width: cardWidth }}>
                <InfoCard
                  icon="flash-outline"
                  iconColor={colors.secondary}
                  bgColor={colors.secondaryBg}
                  label="Tens\u00e3o"
                  value="220 V"
                  subtitle="Est\u00e1vel"
                  subtitleColor={colors.success}
                />
              </FadeInView>
              <FadeInView delay={520} style={{ width: cardWidth }}>
                <InfoCard
                  icon="speedometer-outline"
                  iconColor={colors.purple}
                  bgColor={colors.purpleBg}
                  label="Corrente"
                  value="14.5 A"
                  subtitle="Carga normal"
                  subtitleColor={colors.success}
                />
              </FadeInView>
              <FadeInView delay={580} style={{ width: cardWidth }}>
                <InfoCard
                  icon="pulse-outline"
                  iconColor={colors.primary}
                  bgColor={colors.successBg}
                  label="Pot\u00eancia"
                  value="4.1 kW"
                  subtitle="Demanda atual"
                  subtitleColor={colors.textSecondary}
                />
              </FadeInView>
            </View>
          </FadeInView>
        </LinearGradient>

        {/* ===== SYSTEM STATUS ===== */}
        <View style={s.statusSection}>
          <FadeInView>
            <Text style={s.sectionTag}>Status do Sistema</Text>
          </FadeInView>

          <FadeInView delay={100} style={s.statusCard}>
            <View style={s.statusHeader}>
              <StatusBadge online label="Sistema Online" />
            </View>

            <View style={s.statusRow}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={s.statusLabel}>Ultima atualiza\u00e7\u00e3o</Text>
              <Text style={s.statusValue}>h\u00e1 2 minutos</Text>
            </View>

            <View style={s.statusRow}>
              <Ionicons name="hardware-chip-outline" size={16} color={colors.textMuted} />
              <Text style={s.statusLabel}>Conex\u00e3o ESP32</Text>
              <View style={s.statusIndicator}>
                <PulseDot size={6} color={colors.success} />
                <Text style={s.statusValue}>Conectado</Text>
              </View>
            </View>

            <View style={s.statusRow}>
              <Ionicons name="cloud-outline" size={16} color={colors.textMuted} />
              <Text style={s.statusLabel}>API</Text>
              <View style={s.statusIndicator}>
                <PulseDot size={6} color={colors.success} />
                <Text style={s.statusValue}>Online</Text>
              </View>
            </View>
          </FadeInView>
        </View>

        {/* ===== ENERGY SAVINGS ===== */}
        <View style={s.savingsSection}>
          <FadeInView>
            <Text style={s.sectionTag}>Economia Energ\u00e9tica</Text>
          </FadeInView>

          <FadeInView delay={100} style={s.savingsCard}>
            <View style={s.savingsHeader}>
              <View style={s.savingsIconBox}>
                <Ionicons name="wallet-outline" size={24} color={colors.success} />
              </View>
              <View style={s.savingsHeaderText}>
                <Text style={s.savingsValue}>R$ 2,45</Text>
                <Text style={s.savingsLabel}>Economia hoje</Text>
              </View>
            </View>

            <View style={s.savingsDivider} />

            <View style={s.savingsRow}>
              <Ionicons name="trending-down-outline" size={18} color={colors.success} />
              <Text style={s.savingsRowText}>
                <Text style={{ color: colors.success }}>8%</Text> de redu\u00e7\u00e3o esse m\u00eas
              </Text>
            </View>

            <View style={s.savingsRow}>
              <Ionicons name="flag-outline" size={18} color={colors.warning} />
              <Text style={s.savingsRowText}>
                Meta semanal: <Text style={{ color: colors.warning }}>R$ 12,00</Text>
              </Text>
            </View>

            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '32%' }]} />
            </View>
            <Text style={s.progressLabel}>32% da meta atingida</Text>
          </FadeInView>
        </View>

        {/* ===== WHY ECOSENSE ===== */}
        <View style={s.whySection}>
          <FadeInView style={s.sectionCenter}>
            <Text style={s.sectionTag}>Por que EcoSense?</Text>
            <Text style={s.sectionTitle}>Tecnologia inteligente para sua economia</Text>
            <Text style={s.sectionSub}>
              Nossa plataforma combina sensores IoT, an\u00e1lise de dados e alertas para transformar a forma como voc\u00ea consome energia.
            </Text>
          </FadeInView>

          <View style={s.cardsGrid}>
            {whyCards.map((card, i) => (
              <FadeInView key={i} delay={i * 100} style={s.whyCard}>
                <View style={[s.whyCardIcon, { backgroundColor: card.bg }]}>
                  <Text style={[s.whyCardIconText, { color: card.color }]}>{card.icon}</Text>
                </View>
                <Text style={s.whyCardTitle}>{card.title}</Text>
                <Text style={s.whyCardDesc}>{card.desc}</Text>
              </FadeInView>
            ))}
          </View>
        </View>

        {/* ===== DASHBOARD CTA ===== */}
        <View style={s.ctaSection}>
          <PressScaleButton onPress={() => navigation?.navigate('Dashboard')}>
            <LinearGradient
              colors={['rgba(35,197,94,0.15)', 'rgba(59,130,246,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.ctaCard}
            >
              <View style={s.ctaCardGlow} pointerEvents="none" />
              <View style={s.ctaIconBox}>
                <Ionicons name="grid-outline" size={32} color={colors.primary} />
              </View>
              <Text style={s.ctaCardTitle}>Dashboard Completo</Text>
              <Text style={s.ctaCardDesc}>
                Acompanhe m\u00e9tricas energ\u00e9ticas em tempo real com gr\u00e1ficos e indicadores
              </Text>
              <View style={s.ctaCardAction}>
                <Text style={s.ctaCardActionText}>Acessar Dashboard</Text>
                <Ionicons name="arrow-forward-circle" size={20} color={colors.primary} />
              </View>
            </LinearGradient>
          </PressScaleButton>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            EcoSense \u00a9 {new Date().getFullYear()} — Monitoramento Inteligente de Energia
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* HERO */
  heroWrap: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroInner: {
    alignItems: 'center',
  },
  heroLogo: {
    width: 80,
    height: 56,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondary,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: isSmall ? 26 : 32,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: isSmall ? 34 : 42,
    marginBottom: 14,
  },
  heroGradient: {
    color: colors.primary,
  },
  heroSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },

  /* CTA HERO BUTTON */
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.2,
  },

  /* PANEL */
  panel: {
    marginTop: 32,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderBlue,
    padding: 20,
    overflow: 'hidden',
  },
  panelGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  /* STATUS */
  statusSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: colors.backgroundAlt,
  },
  statusCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  statusHeader: {
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  /* SAVINGS */
  savingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  savingsCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 18,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  savingsIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsHeaderText: {
    flex: 1,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  savingsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  savingsDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  savingsRowText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },

  /* WHY */
  whySection: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    backgroundColor: colors.backgroundAlt,
  },
  sectionCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  whyCard: {
    width: (width - 54) / 2,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  whyCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  whyCardIconText: {
    fontSize: 20,
  },
  whyCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  whyCardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },

  /* DASHBOARD CTA */
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  ctaCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(35,197,94,0.2)',
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaCardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  ctaIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ctaCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaCardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  ctaCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaCardActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },

  /* FOOTER */
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#080E1A',
  },
  footerText: {
    fontSize: 12,
    color: colors.textInactive,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

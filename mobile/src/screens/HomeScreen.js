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
import FadeInView from '../components/FadeInView';
import PulseDot from '../components/PulseDot';
import AnimatedBar from '../components/AnimatedBar';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

const whyCards = [
  {
    icon: '\u26A1',
    color: colors.primary,
    bg: colors.successBg,
    title: 'Monitoramento em Tempo Real',
    desc: 'Acompanhe o consumo de energia elétrica instantaneamente com dados atualizados a cada segundo.',
  },
  {
    icon: '\uD83D\uDCCA',
    color: colors.secondary,
    bg: colors.secondaryBg,
    title: 'Análise de Consumo',
    desc: 'Visualize gráficos detalhados e relatórios inteligentes sobre o uso de energia.',
  },
  {
    icon: '\uD83D\uDD14',
    color: colors.warning,
    bg: colors.warningBg,
    title: 'Alertas Inteligentes',
    desc: 'Receba notificações quando o consumo ultrapassar limites pré-definidos.',
  },
  {
    icon: '\uD83C\uDF31',
    color: colors.purple,
    bg: colors.purpleBg,
    title: 'Eficiência Energética',
    desc: 'Identifique desperdícios e receba sugestões para reduzir sua conta de luz.',
  },
];

const dashboardMetrics = [
  { icon: '\u26A1', bg: colors.successBg, label: 'Consumo Atual', value: '3.2 kWh', sub: '+12% que ontem' },
  { icon: '\uD83D\uDCB0', bg: colors.secondaryBg, label: 'Economia Hoje', value: 'R$ 2,45', sub: 'Meta: R$ 3,00' },
  { icon: '\uD83D\uDCF1', bg: colors.warningBg, label: 'Dispositivos', value: '8 ativos', sub: '2 offline' },
  { icon: '\u26A0\uFE0F', bg: colors.dangerBg, label: 'Alertas Hoje', value: '3', sub: '1 crítico' },
];

const devices = [
  { name: 'Ar Condicionado', status: 'Ligado', consumption: 1.8, pct: 75 },
  { name: 'Geladeira', status: 'Ligado', consumption: 0.9, pct: 40 },
  { name: 'TV Sala', status: 'Ligado', consumption: 0.4, pct: 20 },
  { name: 'Chuveiro', status: 'Desligado', consumption: 0.0, pct: 0 },
  { name: 'Micro-ondas', status: 'Standby', consumption: 0.1, pct: 5 },
];

const chartHeights = [65, 45, 80, 55, 90, 40, 70, 50, 75, 60, 85, 35];

function AnimatedDeviceBar({ pct, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  const widthAnim = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${pct}%`],
  });

  return (
    <Animated.View
      style={{
        height: '100%',
        borderRadius: 6,
        backgroundColor: '#23C55E',
        width: widthAnim,
      }}
    />
  );
}



export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      {/* ===== HERO ===== */}
      <LinearGradient colors={['#0A1120', '#0F172A', '#14213D']} style={s.heroWrap}>
        <FadeInView style={s.heroInner}>
          <Image source={require('../../assets/logo.png')} style={s.heroLogo} resizeMode="contain" />

          <View style={s.badge}>
            <PulseDot />
            <Text style={s.badgeText}>Plataforma IoT de Monitoramento</Text>
          </View>

          <Text style={s.heroTitle}>
            Eficiência Energética em{'\n'}
            <Text style={s.heroGradient}>tempo real</Text>
          </Text>

          <Text style={s.heroSub}>
            Monitore o consumo de energia da sua residência ou empresa com sensores IoT inteligentes.
          </Text>

          <View style={s.heroActions}>
            <TouchableOpacity
              style={s.btnPrimary}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('Dashboard')}
            >
              <Text style={s.btnPrimaryText}>Explorar Dashboard \u2192</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.btnSecondary}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <Text style={s.btnSecondaryText}>Saiba Mais</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* PAINEL VISUAL */}
        <FadeInView delay={300} style={s.panel}>
          <View style={s.panelGlow} pointerEvents="none" />
          <Text style={s.panelTitle}>Monitoramento ao Vivo</Text>

          <View style={s.panelMetrics}>
            {[
              { label: 'Consumo', value: '3.2 kWh', color: '#23C55E', change: '\u2191 12%' },
              { label: 'Tensão', value: '220V', color: '#3B82F6', change: 'Estável' },
              { label: 'Demanda', value: '4.1 kW', color: '#FFFFFF', change: '\u2191 8%' },
              { label: 'Fator Pot.', value: '0.92', color: '#23C55E', change: 'Ideal' },
            ].map((m, i) => (
              <View key={i} style={s.panelMetric}>
                <Text style={s.panelMetricLabel}>{m.label}</Text>
                <Text style={[s.panelMetricValue, { color: m.color }]}>{m.value}</Text>
                <Text style={[s.panelMetricChange, { color: m.change.includes('\u2191') && m.label !== 'Tensão' && m.label !== 'Fator Pot.' ? '#EF4444' : '#23C55E' }]}>
                  {m.change}
                </Text>
              </View>
            ))}
          </View>

          {/* ANIMATED BARS */}
          <View style={s.barsSection}>
            <Text style={s.barsLabel}>Circuitos</Text>
            {[
              { label: 'Circuito 1', pct: 75, value: '1.8kW' },
              { label: 'Circuito 2', pct: 40, value: '0.9kW' },
              { label: 'Circuito 3', pct: 20, value: '0.4kW' },
            ].map((b, i) => (
              <View key={i} style={s.barRow}>
                <Text style={s.barLabel}>{b.label}</Text>
                <View style={s.barTrack}>
                  <AnimatedDeviceBar pct={b.pct} delay={500 + i * 200} />
                </View>
                <Text style={s.barValue}>{b.value}</Text>
              </View>
            ))}
          </View>

          {/* IoT NODES */}
          <View style={s.nodesSection}>
            <View style={[s.node, { left: '8%', top: 0 }]}>
              <View style={[s.nodeDot, { backgroundColor: '#3B82F6' }]} />
            </View>
            <View style={[s.node, { left: '42%', top: '-10%' }]}>
              <View style={[s.nodeDot, { backgroundColor: '#23C55E' }]} />
            </View>
            <View style={[s.node, { left: '75%', top: '5%' }]}>
              <View style={[s.nodeDot, { backgroundColor: '#3B82F6' }]} />
            </View>
            <View style={[s.node, { left: '20%', top: '50%' }]}>
              <View style={[s.nodeDot, { backgroundColor: '#23C55E' }]} />
            </View>
            <View style={[s.node, { left: '65%', top: '40%' }]}>
              <View style={[s.nodeDot, { backgroundColor: '#3B82F6' }]} />
            </View>
            <View style={[s.nodeLine, { top: '8%', left: '8%', width: '34%' }]} />
            <View style={[s.nodeLine, { top: '0%', left: '42%', width: '33%' }]} />
            <View style={[s.nodeLine, { top: '30%', left: '20%', width: '45%' }]} />
          </View>
        </FadeInView>
      </LinearGradient>

      {/* ===== WHY ECOSENSE ===== */}
      <View style={s.whySection}>
        <FadeInView style={s.sectionHeader}>
          <Text style={s.sectionTag}>Por que EcoSense?</Text>
          <Text style={s.sectionTitle}>Tecnologia inteligente para sua economia</Text>
          <Text style={s.sectionSub}>
            Nossa plataforma combina sensores IoT, análise de dados e alertas para transformar a forma como você consome energia.
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

      {/* ===== DASHBOARD MOCKUP ===== */}
      <View style={s.dashSection}>
        <FadeInView style={s.sectionHeader}>
          <Text style={s.sectionTag}>Visualize seus dados</Text>
          <Text style={s.sectionTitle}>Dashboard completo e intuitivo</Text>
          <Text style={s.sectionSub}>
            Todos os indicadores essenciais em um só lugar para decisões rápidas e inteligentes.
          </Text>
        </FadeInView>

        <FadeInView delay={200} style={s.dashMockup}>
          {/* METRIC CARDS */}
          <View style={s.dashGrid}>
            {dashboardMetrics.map((m, i) => (
              <FadeInView key={i} delay={300 + i * 80} style={s.dashCard}>
                <View style={s.dashCardHeader}>
                  <View style={[s.dashCardIconBox, { backgroundColor: m.bg }]}>
                    <Text style={s.dashCardIcon}>{m.icon}</Text>
                  </View>
                  <Text style={s.dashCardLabel}>{m.label}</Text>
                </View>
                <Text style={s.dashCardValue}>{m.value}</Text>
                <Text style={s.dashCardSub}>{m.sub}</Text>
              </FadeInView>
            ))}
          </View>

          {/* CHART */}
          <View style={s.chartSection}>
            <Text style={s.chartTitle}>Consumo (últimas 12 horas)</Text>
            <View style={s.chartBars}>
              {chartHeights.map((h, i) => (
                <AnimatedBar key={i} height={h} index={i} />
              ))}
            </View>
          </View>

          {/* DEVICES */}
          <View style={s.devicesSection}>
            <Text style={s.chartTitle}>Dispositivos Conectados</Text>
            {devices.map((d, i) => (
              <FadeInView key={i} delay={400 + i * 80} style={s.deviceRow}>
                <View style={s.deviceIconBox}>
                  <Text style={s.deviceIcon}>📱</Text>
                </View>
                <View style={s.deviceInfo}>
                  <Text style={s.deviceName}>{d.name}</Text>
                  <Text style={[s.deviceStatus, { color: d.status === 'Ligado' ? '#23C55E' : d.status === 'Standby' ? '#F59E0B' : '#64748B' }]}>
                    {d.status}
                  </Text>
                </View>
                <View style={s.deviceBarTrack}>
                  <AnimatedDeviceBar pct={d.pct} delay={600 + i * 100} />
                </View>
                <Text style={s.deviceConsumption}>{d.consumption}kW</Text>
              </FadeInView>
            ))}
          </View>
        </FadeInView>
      </View>

      {/* FOOTER */}
      <View style={s.footer}>
        <Text style={s.footerText}>EcoSense © {new Date().getFullYear()} — Monitoramento Inteligente de Energia</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  /* HERO */
  heroWrap: {
    paddingTop: 50,
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
    backgroundColor: 'rgba(59,130,246,0.12)',
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
    color: '#3B82F6',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: isSmall ? 26 : 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isSmall ? 34 : 42,
    marginBottom: 14,
  },
  heroGradient: {
    color: '#23C55E',
  },
  heroSub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#23C55E',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  btnSecondaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  /* PANEL */
  panel: {
    marginTop: 32,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
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
    color: '#64748B',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  panelMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  panelMetric: {
    width: (width - 80) / 2,
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
  },
  panelMetricLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  panelMetricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  panelMetricChange: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  /* BARS */
  barsSection: {
    marginBottom: 16,
  },
  barsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#94A3B8',
    width: 70,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barValue: {
    fontSize: 11,
    color: '#94A3B8',
    width: 40,
    textAlign: 'right',
  },

  /* NODES */
  nodesSection: {
    height: 80,
    position: 'relative',
    marginTop: 4,
  },
  node: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(35,197,94,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(35,197,94,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nodeLine: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(59,130,246,0.2)',
  },

  /* WHY */
  whySection: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    backgroundColor: '#0A1120',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#23C55E',
    backgroundColor: 'rgba(35,197,94,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 14,
    color: '#94A3B8',
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
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  whyCardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
  },

  /* DASHBOARD */
  dashSection: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  dashMockup: {
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
  },
  dashGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  dashCard: {
    width: (width - 66) / 2,
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 14,
  },
  dashCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dashCardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashCardIcon: {
    fontSize: 14,
  },
  dashCardLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  dashCardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  dashCardSub: {
    fontSize: 11,
    color: '#23C55E',
    fontWeight: '600',
  },

  /* CHART */
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 120,
  },

  /* DEVICES */
  devicesSection: {},
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  deviceIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(59,130,246,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceIcon: {
    fontSize: 13,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deviceStatus: {
    fontSize: 11,
    marginTop: 1,
  },
  deviceBarTrack: {
    width: 80,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  deviceConsumption: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },

  /* FOOTER */
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#080E1A',
  },
  footerText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

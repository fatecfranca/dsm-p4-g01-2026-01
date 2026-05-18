import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isSmall = width < 380;

function FadeInView({ children, delay = 0, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#23C55E',
        opacity: anim,
      }}
    />
  );
}

function GlowNode({ delay, style }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const glow = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View style={[style, { opacity: glow }]}>
      <View style={s.nodeDotInner} />
    </Animated.View>
  );
}

const projectCards = [
  {
    icon: '\u26A1',
    color: '#23C55E',
    bg: 'rgba(35,197,94,0.12)',
    title: 'Propósito',
    desc: 'Monitorar e otimizar o consumo de energia elétrica usando ESP32 e sensores SCT-013 (corrente) e ZMPT101B (tensão).',
  },
  {
    icon: '\uD83D\uDD0C',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
    title: 'Tecnologia IoT',
    desc: 'Sensores conectados via ESP32 enviam dados para o backend Node.js + MongoDB com comunicação eficiente e confiável.',
  },
  {
    icon: '\uD83D\uDCCA',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Dados Precisos',
    desc: 'Coleta e armazenamento confiável de métricas elétricas para análises detalhadas do consumo de energia.',
  },
  {
    icon: '\uD83D\uDCA1',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.12)',
    title: 'Visualização',
    desc: 'Dashboard interativo com gráficos dinâmicos e indicadores em tempo real para decisões inteligentes.',
  },
];

const techs = [
  { name: 'React Native', icon: '\uD83D\uDCF1', color: '#3B82F6' },
  { name: 'Node.js', icon: '\uD83D\uDFE2', color: '#23C55E' },
  { name: 'MongoDB', icon: '\uD83C\uDF33', color: '#1EA454' },
  { name: 'ESP32', icon: '\uD83D\uDEE0\uFE0F', color: '#F59E0B' },
  { name: 'IoT', icon: '\uD83C\uDF10', color: '#8B5CF6' },
  { name: 'Gr\u00E1ficos', icon: '\uD83D\uDCC8', color: '#EC4899' },
];

const team = [
  { initials: 'IR', name: 'Iago Rodrigues Pinheiro', role: 'Desenvolvedor' },
  { initials: 'PX', name: 'Pedro Henrique Xavier Constancio', role: 'Desenvolvedor' },
  { initials: 'KL', name: 'Kaio Leandro Rissato', role: 'Desenvolvedor' },
];

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      {/* ===== HERO ===== */}
      <LinearGradient colors={['#0A1120', '#0F172A', '#14213D']} style={s.heroWrap}>
        <FadeInView style={s.heroInner}>
          <View style={s.badge}>
            <PulseDot />
            <Text style={s.badgeText}>IoT CONECTADO</Text>
          </View>

          <Text style={s.heroLabel}>Sobre o Projeto</Text>
          <Text style={s.heroTitle}>
            Transformando dados em{'\n'}energia inteligente
          </Text>
          <Text style={s.heroSub}>
            O EcoSense \u00E9 uma plataforma IoT de monitoramento energ\u00E9tico que
            combina sensores de corrente e tens\u00E3o, microcontroladores ESP32 e
            uma dashboard interativa para fornecer insights precisos sobre o
            consumo de energia el\u00E9trica em tempo real.
          </Text>
        </FadeInView>

        {/* IoT NETWORK VISUAL */}
        <FadeInView delay={300} style={s.iotPanel}>
          <View style={s.iotGlow} pointerEvents="none" />
          <Text style={s.iotPanelLabel}>REDE DE SENSORES</Text>

          <View style={s.iotNodesWrap}>
            <GlowNode delay={0} style={[s.iotNode, { left: '5%', top: '10%' }]} />
            <GlowNode delay={400} style={[s.iotNodeBlue, { left: '40%', top: '0%' }]} />
            <GlowNode delay={800} style={[s.iotNode, { left: '75%', top: '15%' }]} />
            <GlowNode delay={1200} style={[s.iotNodeBlue, { left: '15%', top: '55%' }]} />
            <GlowNode delay={1600} style={[s.iotNode, { left: '60%', top: '45%' }]} />

            <View style={[s.iotLine, { top: '20%', left: '5%', width: '35%' }]} />
            <View style={[s.iotLineBlue, { top: '10%', left: '40%', width: '35%' }]} />
            <View style={[s.iotLine, { top: '35%', left: '15%', width: '45%' }]} />
            <View style={[s.iotLineBlue, { top: '30%', left: '60%', width: '15%' }]} />
          </View>

          <View style={s.iotStats}>
            <View style={s.iotStat}>
              <Text style={s.iotStatValue}>ESP32</Text>
              <Text style={s.iotStatLabel}>Controlador</Text>
            </View>
            <View style={s.iotStat}>
              <Text style={s.iotStatValue}>SCT-013</Text>
              <Text style={s.iotStatLabel}>Corrente</Text>
            </View>
            <View style={s.iotStat}>
              <Text style={s.iotStatValue}>ZMPT101B</Text>
              <Text style={s.iotStatLabel}>Tens\u00E3o</Text>
            </View>
          </View>
        </FadeInView>
      </LinearGradient>

      {/* ===== SOBRE O PROJETO ===== */}
      <View style={s.section}>
        <FadeInView style={s.sectionHeader}>
          <Text style={s.sectionTag}>Sobre o Projeto</Text>
          <Text style={s.sectionTitle}>
            Tecnologia a servi\u00E7o da efici\u00EAncia
          </Text>
          <Text style={s.sectionSub}>
            Conhe\u00E7a os pilares que sustentam a plataforma EcoSense
          </Text>
        </FadeInView>

        <View style={s.cardsGrid}>
          {projectCards.map((card, i) => (
            <FadeInView key={i} delay={i * 100} style={s.card}>
              <View style={[s.cardIcon, { backgroundColor: card.bg }]}>
                <Text style={[s.cardIconText, { color: card.color }]}>
                  {card.icon}
                </Text>
              </View>
              <Text style={s.cardTitle}>{card.title}</Text>
              <Text style={s.cardDesc}>{card.desc}</Text>
            </FadeInView>
          ))}
        </View>
      </View>

      {/* ===== TECNOLOGIAS ===== */}
      <View style={[s.section, { backgroundColor: '#0A1120' }]}>
        <FadeInView style={s.sectionHeader}>
          <Text style={s.sectionTag}>Tecnologias</Text>
          <Text style={s.sectionTitle}>Stack do Projeto</Text>
          <Text style={s.sectionSub}>
            Ferramentas e tecnologias utilizadas no EcoSense
          </Text>
        </FadeInView>

        <View style={s.techGrid}>
          {techs.map((tech, i) => (
            <FadeInView key={i} delay={i * 80} style={[s.techCard, { borderColor: `${tech.color}25` }]}>
              <View style={[s.techIcon, { backgroundColor: `${tech.color}15` }]}>
                <Text style={s.techIconText}>{tech.icon}</Text>
              </View>
              <Text style={s.techName}>{tech.name}</Text>
            </FadeInView>
          ))}
        </View>
      </View>

      {/* ===== EQUIPE ===== */}
      <View style={s.section}>
        <FadeInView style={s.sectionHeader}>
          <Text style={s.sectionTag}>Equipe</Text>
          <Text style={s.sectionTitle}>Quem faz o EcoSense</Text>
          <Text style={s.sectionSub}>
            Conhe\u00E7a os desenvolvedores por tr\u00E1s do projeto
          </Text>
        </FadeInView>

        <View style={s.teamList}>
          {team.map((member, i) => (
            <FadeInView key={i} delay={i * 120} style={s.teamCard}>
              <View style={s.teamAvatar}>
                <Text style={s.teamAvatarText}>{member.initials}</Text>
              </View>
              <View style={s.teamInfo}>
                <Text style={s.teamName}>{member.name}</Text>
                <Text style={s.teamRole}>{member.role}</Text>
              </View>
            </FadeInView>
          ))}
        </View>
      </View>

      {/* FOOTER */}
      <View style={s.footer}>
        <Text style={s.footerText}>
          EcoSense \u00A9 {new Date().getFullYear()} — Monitoramento Inteligente de Energia
        </Text>
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(35,197,94,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(35,197,94,0.25)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#23C55E',
    letterSpacing: 0.5,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: isSmall ? 24 : 30,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isSmall ? 32 : 40,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
  },

  /* IOT PANEL */
  iotPanel: {
    marginTop: 32,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(35,197,94,0.15)',
    padding: 20,
    overflow: 'hidden',
  },
  iotGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  iotPanelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 16,
  },
  iotNodesWrap: {
    height: 80,
    position: 'relative',
    marginBottom: 20,
  },
  iotNode: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(35,197,94,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(35,197,94,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iotNodeBlue: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(59,130,246,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#23C55E',
  },
  iotLine: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(35,197,94,0.25)',
  },
  iotLineBlue: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(59,130,246,0.25)',
  },
  iotStats: {
    flexDirection: 'row',
    gap: 8,
  },
  iotStat: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  iotStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  iotStatLabel: {
    fontSize: 10,
    color: '#64748B',
  },

  /* SECTION */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 28,
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
    fontSize: 22,
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
    maxWidth: 300,
  },

  /* CARDS GRID */
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  card: {
    width: (width - 54) / 2,
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
  },

  /* TECHS */
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  techCard: {
    width: (width - 64) / 3,
    backgroundColor: 'rgba(30,41,59,0.3)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  techIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  techIconText: {
    fontSize: 22,
  },
  techName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  /* TEAM */
  teamList: {
    gap: 12,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(30,41,59,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 18,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(35,197,94,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(35,197,94,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#23C55E',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 13,
    color: '#94A3B8',
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

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const PROJETO_CARDS = [
  {
    Icon: PropIcon,
    color: colors.success,
    bg: 'rgba(34,197,94,0.08)',
    title: 'Propósito',
    text: 'Democratizar o acesso ao monitoramento energético, permitindo que qualquer pessoa acompanhe e reduza seu consumo de forma inteligente.',
  },
  {
    Icon: IotIcon,
    color: colors.secondary,
    bg: 'rgba(59,130,246,0.08)',
    title: 'Tecnologia IoT',
    text: 'Sensores de corrente ACS712 20A e voltagem ZMPT101B conectados a um ESP32 enviam dados em tempo real para processamento.',
  },
  {
    Icon: PulseIcon,
    color: colors.info,
    bg: 'rgba(6,182,212,0.08)',
    title: 'Dados Precisos',
    text: 'Cálculos de potência, consumo e gasto processados por uma API Node.js e armazenados no MongoDB para análise histórica.',
  },
  {
    Icon: BarsIcon,
    color: colors.warning,
    bg: 'rgba(245,158,11,0.08)',
    title: 'Visualização',
    text: 'Dashboard interativo com gráficos, relatórios e alertas visuais para tomada de decisão rápida e eficiente.',
  },
];

const TECHS = [
  { abbr: 'Re', name: 'React', desc: 'Interface moderna e reativa', color: colors.info },
  { abbr: 'No', name: 'Node.js', desc: 'API robusta e escalável', color: colors.success },
  { abbr: 'Mo', name: 'MongoDB', desc: 'Banco de dados flexível', color: colors.success },
  { abbr: 'ES', name: 'ESP32', desc: 'Microcontrolador IoT', color: colors.secondary },
  { abbr: 'Io', name: 'IoT', desc: 'Sensores de corrente e tensão', color: colors.warning },
  { abbr: 'Rc', name: 'Recharts', desc: 'Gráficos dinâmicos e interativos', color: colors.success },
];

const TEAM = [
  { initials: 'IR', name: 'Iago Rodrigues Pinheiro', role: 'Desenvolvedor Front-end / Mobile', color: colors.success },
  { initials: 'PC', name: 'Pedro Henrique Xavier Constancio', role: 'Desenvolvedor Back-end / IoT', color: colors.secondary },
  { initials: 'KR', name: 'Kaio Leandro Rissato', role: 'Desenvolvedor Mobile / IoT', color: colors.info },
];

function PropIcon({ color }) {
  return <View style={[styles.projPulse, { backgroundColor: color, shadowColor: color }]} />;
}

function IotIcon({ color }) {
  return <Text style={[styles.projIconText, { color }]}>IoT</Text>;
}

function PulseIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Svg>
  );
}

function BarsIcon({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20V10" />
      <Path d="M18 20V4" />
      <Path d="M6 20v-4" />
    </Svg>
  );
}

function ProjectCard({ card, width: cardWidth }) {
  const { Icon, color, bg, title, text } = card;
  return (
    <View style={[styles.projetoCard, { width: cardWidth }]}>
      <View style={[styles.projIcon, { backgroundColor: bg }]}>
        <Icon color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

function TechCard({ tech, width: cardWidth }) {
  return (
    <View style={[styles.techCard, { width: cardWidth, borderColor: `${tech.color}25` }]}>
      <View style={[styles.techIcon, { backgroundColor: `${tech.color}15` }]}>
        <Text style={styles.techIconText}>{tech.abbr}</Text>
      </View>
      <Text style={styles.techName}>{tech.name}</Text>
      <Text style={styles.techDesc}>{tech.desc}</Text>
    </View>
  );
}

function MemberCard({ member }) {
  return (
    <View style={styles.memberCard}>
      <View style={[styles.memberAvatar, { borderColor: `${member.color}4D` }]}>
        <Text style={styles.memberInitials}>{member.initials}</Text>
        <View style={[styles.avatarGlow, { backgroundColor: member.color }]} />
      </View>
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={[styles.memberRole, { color: member.color }]}>{member.role}</Text>
      <View style={styles.memberSocial}>
        <View style={[styles.socialDot, { backgroundColor: member.color }]} />
        <View style={[styles.socialDot, { backgroundColor: member.color }]} />
        <View style={[styles.socialDot, { backgroundColor: member.color }]} />
      </View>
    </View>
  );
}

function SectionDivider() {
  return <View style={styles.divider} />;
}

function HeroNetwork() {
  return (
    <View style={styles.networkPanel}>
      <View style={styles.networkGrid} />
      <View style={styles.networkGlow} />
      <View style={[styles.netNode, { top: '20%', left: '20%', backgroundColor: colors.success }]} />
      <View style={[styles.netNode, { top: '60%', left: '75%', backgroundColor: colors.secondary }]} />
      <View style={[styles.netNode, { top: '75%', left: '30%', backgroundColor: colors.info }]} />
      <View style={[styles.netNode, { top: '30%', left: '80%', backgroundColor: colors.warning }]} />
      <View style={[styles.netNode, { top: '50%', left: '50%', width: 10, height: 10, backgroundColor: colors.success }]} />

      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 300" preserveAspectRatio="none">
        <Path d="M 80 75 L 200 150" stroke="rgba(34,197,94,0.18)" strokeWidth={1.5} fill="none" />
        <Path d="M 200 150 L 300 180" stroke="rgba(59,130,246,0.18)" strokeWidth={1.5} fill="none" />
        <Path d="M 300 180 L 120 225" stroke="rgba(6,182,212,0.18)" strokeWidth={1.5} fill="none" />
        <Path d="M 120 225 L 320 90" stroke="rgba(245,158,11,0.18)" strokeWidth={1.5} fill="none" />
      </Svg>

      <View style={styles.networkBadge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>IoT CONECTADO</Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const projetoCardWidth = (width - 52) / 2;
  const techCardWidth = (width - 60) / 3;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={['#0A1120', '#0F172A', '#14213D']} style={styles.hero}>
          <View style={styles.heroTag}>
            <View style={styles.heroTagDot} />
            <Text style={styles.heroTagText}>Sobre o Projeto</Text>
          </View>

          <Text style={styles.heroTitle}>
            Transformando dados em{'\n'}
            <Text style={styles.heroGradient}>energia inteligente</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            O EcoSense nasceu para resolver um desafio real: monitorar o
            consumo de energia de forma acessível, precisa e em tempo real
            usando tecnologia IoT.
          </Text>

          <HeroNetwork />
        </LinearGradient>

        <SectionDivider />

        <View style={styles.projeto}>
          <Text style={styles.sectionTag}>Sobre o Projeto</Text>
          <Text style={styles.sectionTitle}>Tecnologia a serviço da eficiência</Text>
          <Text style={styles.sectionSubtitle}>
            Conheça os pilares que sustentam a plataforma EcoSense
          </Text>

          <View style={styles.projetoGrid}>
            {PROJETO_CARDS.map((card, i) => (
              <ProjectCard key={i} card={card} width={projetoCardWidth} />
            ))}
          </View>
        </View>

        <SectionDivider />

        <View style={styles.techSection}>
          <Text style={styles.sectionTag}>Tecnologias</Text>
          <Text style={styles.sectionTitle}>Stack do Projeto</Text>
          <Text style={styles.sectionSubtitle}>
            Ferramentas e tecnologias utilizadas no EcoSense
          </Text>

          <View style={styles.techGrid}>
            {TECHS.map((tech, i) => (
              <TechCard key={i} tech={tech} width={techCardWidth} />
            ))}
          </View>
        </View>

        <SectionDivider />

        <View style={styles.equipe}>
          <Text style={styles.sectionTag}>Equipe</Text>
          <Text style={styles.sectionTitle}>Quem faz o EcoSense</Text>
          <Text style={styles.sectionSubtitle}>
            Conheça os desenvolvedores por trás do projeto
          </Text>

          <View style={styles.equipeList}>
            {TEAM.map((member, i) => (
              <MemberCard key={i} member={member} />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            P.I 4º Semestre — EcoSense — Monitoramento inteligente para um futuro sustentável
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  hero: {
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
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
    marginBottom: 28,
    maxWidth: 320,
  },

  networkPanel: {
    width: '100%',
    height: 240,
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(51,65,85,0.5)',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  networkGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  networkGlow: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -120,
    width: 240,
    height: 240,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 120,
  },
  netNode: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkBadge: {
    position: 'absolute',
    bottom: 18,
    left: '50%',
    marginLeft: -60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    borderRadius: 100,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success,
    letterSpacing: 1.2,
  },

  divider: {
    height: 1,
    marginHorizontal: 40,
    backgroundColor: colors.border,
    opacity: 0.4,
  },

  projeto: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 48,
  },
  techSection: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 48,
  },
  equipe: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  sectionTag: {
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 12,
    letterSpacing: 1,
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
    marginBottom: 28,
    maxWidth: 320,
    alignSelf: 'center',
  },

  projetoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  projetoCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 16,
  },
  projIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  projIconText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  projPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOpacity: 0.5,
    shadowRadius: 8,
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

  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  techCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  techIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  techIconText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  techName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  techDesc: {
    fontSize: 9,
    lineHeight: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  equipeList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(30,41,59,0.6)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  memberInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  avatarGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 42,
    opacity: 0.18,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  memberSocial: {
    flexDirection: 'row',
    gap: 6,
  },
  socialDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
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

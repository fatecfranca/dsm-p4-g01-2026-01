import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeInView from '../components/FadeInView';
import InfoCard from '../components/InfoCard';
import StatusBadge from '../components/StatusBadge';
import AnimatedBar from '../components/AnimatedBar';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 52) / 2;

const chartData = [
  { hour: '06h', value: 35 },
  { hour: '07h', value: 45 },
  { hour: '08h', value: 80 },
  { hour: '09h', value: 55 },
  { hour: '10h', value: 90 },
  { hour: '11h', value: 40 },
  { hour: '12h', value: 70 },
  { hour: '13h', value: 50 },
  { hour: '14h', value: 75 },
  { hour: '15h', value: 60 },
  { hour: '16h', value: 85 },
  { hour: '17h', value: 42 },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <FadeInView style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Painel de Monitoramento</Text>
              <Text style={styles.subtitle}>EcoSense IoT</Text>
            </View>
            <StatusBadge online label="Online" />
          </View>
        </FadeInView>

        {/* METRIC CARDS */}
        <View style={styles.cardsGrid}>
          <FadeInView delay={100} style={[styles.cardWrapper, { width: cardWidth }]}>
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
          <FadeInView delay={180} style={[styles.cardWrapper, { width: cardWidth }]}>
            <InfoCard
              icon="flash-outline"
              iconColor={colors.secondary}
              bgColor={colors.secondaryBg}
              label="Tensão"
              value="220 V"
              subtitle="Est\u00e1vel"
              subtitleColor={colors.success}
            />
          </FadeInView>
          <FadeInView delay={260} style={[styles.cardWrapper, { width: cardWidth }]}>
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
          <FadeInView delay={340} style={[styles.cardWrapper, { width: cardWidth }]}>
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

        {/* ENERGY SUMMARY */}
        <FadeInView delay={420} style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumo Energ\u00e9tico</Text>

          <View style={styles.chartContainer}>
            <Text style={styles.chartLabel}>Consumo (kWh) — \u00faltimas 12 horas</Text>
            <View style={styles.chartBars}>
              {chartData.map((d, i) => (
                <AnimatedBar key={i} height={d.value * 1.2} index={i} />
              ))}
            </View>
            <View style={styles.chartLabels}>
              {chartData.filter((_, i) => i % 2 === 0).map((d, i) => (
                <Text key={i} style={styles.chartLabelText}>{d.hour}</Text>
              ))}
            </View>
          </View>

          <View style={styles.estimateRow}>
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>Estimativa do M\u00eas</Text>
              <Text style={styles.estimateValue}>R$ 142,50</Text>
            </View>
            <View style={styles.estimateDivider} />
            <View style={styles.estimateItem}>
              <Text style={styles.estimateLabel}>Economia</Text>
              <Text style={[styles.estimateValue, { color: colors.success }]}>R$ 18,30</Text>
            </View>
          </View>
        </FadeInView>

        {/* FOOTER */}
        <FadeInView delay={500} style={styles.footer}>
          <Text style={styles.footerText}>
            EcoSense \u00a9 {new Date().getFullYear()} — Monitoramento Inteligente de Energia
          </Text>
        </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* HEADER */
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  /* CARDS GRID */
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardWrapper: {},

  /* SUMMARY */
  summarySection: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 110,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  chartLabelText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  estimateRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  estimateItem: {
    flex: 1,
    alignItems: 'center',
  },
  estimateDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },
  estimateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  estimateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  /* FOOTER */
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textInactive,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

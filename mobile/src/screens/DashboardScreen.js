import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeInView from '../components/FadeInView';
import StatusBadge from '../components/StatusBadge';
import KpiCard from '../components/cards/KpiCard';
import LineChartWidget from '../components/charts/LineChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import GaugeWidget from '../components/charts/GaugeWidget';
import useTelemetryData from '../hooks/useTelemetryData';
import { colors } from '../theme/colors';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    powerData,
    voltageData,
    currentData,
    dailyData,
    financialData,
    voltage,
    current,
    power,
    monthlyCost,
    frequency,
    powerFactor,
    peakPowerIndex,
    peakVoltageIndex,
    peakCurrentIndex,
    maxKwhIndex,
    maxCostIndex,
  } = useTelemetryData();

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
              <Text style={styles.greeting}>Dashboard</Text>
              <Text style={styles.subtitle}>Monitoramento em Tempo Real</Text>
            </View>
            <StatusBadge online label="Online" />
          </View>
        </FadeInView>

        {/* KPI CARDS */}
        <View style={styles.kpiRow}>
          <FadeInView delay={80} style={styles.kpiWrapper}>
            <KpiCard
              icon="flash-outline"
              iconColor={colors.warning}
              bgColor={colors.warningBg}
              label="Tensão"
              value={voltage}
              unit="V"
              subtitle="Rede estável"
              subtitleColor={colors.success}
            />
          </FadeInView>
          <FadeInView delay={140} style={styles.kpiWrapper}>
            <KpiCard
              icon="speedometer-outline"
              iconColor={colors.secondary}
              bgColor={colors.secondaryBg}
              label="Corrente"
              value={current}
              unit="A"
              subtitle="Carga normal"
              subtitleColor={colors.success}
            />
          </FadeInView>
        </View>

        <View style={styles.kpiRow}>
          <FadeInView delay={200} style={styles.kpiWrapper}>
            <KpiCard
              icon="pulse-outline"
              iconColor={colors.primary}
              bgColor={colors.successBg}
              label="Potência"
              value={power}
              unit="W"
              subtitle="Demanda atual"
              subtitleColor={colors.textSecondary}
            />
          </FadeInView>
          <FadeInView delay={260} style={styles.kpiWrapper}>
            <KpiCard
              icon="wallet-outline"
              iconColor={colors.purple}
              bgColor={colors.purpleBg}
              label="Custo Estimado"
              value={`R$ ${monthlyCost.toFixed(2)}`}
              subtitle="Projeção mensal"
              subtitleColor={colors.textSecondary}
            />
          </FadeInView>
        </View>

        {/* POWER CHART */}
        <FadeInView delay={320}>
          <LineChartWidget
            data={powerData}
            peakIndex={peakPowerIndex}
            title="Potência em Tempo Real"
            unit="W"
            lineColor={colors.primary}
          />
        </FadeInView>

        {/* VOLTAGE CHART */}
        <FadeInView delay={380}>
          <LineChartWidget
            data={voltageData}
            peakIndex={peakVoltageIndex}
            title="Tensão da Rede"
            unit="V"
            lineColor={colors.warning}
          />
        </FadeInView>

        {/* CURRENT CHART */}
        <FadeInView delay={440}>
          <LineChartWidget
            data={currentData}
            peakIndex={peakCurrentIndex}
            title="Corrente Elétrica"
            unit="A"
            lineColor={colors.secondary}
          />
        </FadeInView>

        {/* CONSUMPTION BAR CHART */}
        <FadeInView delay={500}>
          <BarChartWidget
            data={dailyData}
            maxIndex={maxKwhIndex}
            title="Consumo Diário (kWh)"
            unit=""
            barColor={colors.primary}
          />
        </FadeInView>

        {/* FINANCIAL BAR CHART */}
        <FadeInView delay={560}>
          <BarChartWidget
            data={financialData}
            maxIndex={maxCostIndex}
            title="Custo Diário (R$)"
            unit="R$"
            barColor={colors.purple}
          />
        </FadeInView>

        {/* GAUGE */}
        <FadeInView delay={620}>
          <GaugeWidget frequency={frequency} powerFactor={powerFactor} />
        </FadeInView>

        {/* FOOTER */}
        <FadeInView delay={680} style={styles.footer}>
          <Text style={styles.footerText}>
            EcoSense © {new Date().getFullYear()} — Monitoramento Inteligente de
            Energia
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

  /* KPI */
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  kpiWrapper: {
    flex: 1,
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

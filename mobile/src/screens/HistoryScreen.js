import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeInView from '../components/FadeInView';
import LineChartWidget from '../components/charts/LineChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import { getTelemetria } from '../services/telemetryService';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await getTelemetria('ESP32-001', 100);
        setReadings(response.data || []);
      } catch {
        setReadings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reversed = [...readings].reverse();
  const totalKwh = readings.reduce((s, r) => s + (r.consumokWh || 0), 0);
  const totalCost = readings.reduce((s, r) => s + (r.custoReais || 0), 0);
  const avgPower = readings.length
    ? (readings.reduce((s, r) => s + (r.potenciaAtiva || 0), 0) / readings.length).toFixed(1)
    : 0;

  const chartData = reversed.map((r) => {
    const d = new Date(r.timestamp);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return { time: `${h}:${m}`, value: r.potenciaAtiva || 0 };
  });

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dailyMap = {};
  readings.forEach((r) => {
    const d = new Date(r.timestamp);
    const dayName = days[d.getDay()];
    if (!dailyMap[dayName]) dailyMap[dayName] = [];
    dailyMap[dayName].push(r.consumokWh || 0);
  });
  const dailyData = days.map((day) => ({
    day,
    value: dailyMap[day]
      ? +(dailyMap[day].reduce((a, b) => a + b, 0) / dailyMap[day].length).toFixed(1)
      : 0,
  }));

  const peakIdx = chartData.reduce(
    (max, item, i) => (item.value > (chartData[max]?.value || 0) ? i : max),
    0
  );
  const maxDailyIdx = dailyData.reduce(
    (max, item, i) => (item.value > (dailyData[max]?.value || 0) ? i : max),
    0
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <FadeInView style={styles.header}>
          <Text style={styles.title}>Histórico de Consumo</Text>
          <Text style={styles.subtitle}>Últimas {readings.length} leituras</Text>
        </FadeInView>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryRow}>
          <FadeInView delay={80} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Consumo Total</Text>
            <Text style={styles.summaryValue}>{totalKwh.toFixed(2)}</Text>
            <Text style={styles.summaryUnit}>kWh</Text>
          </FadeInView>
          <FadeInView delay={120} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Custo Total</Text>
            <Text style={styles.summaryValue}>R$ {totalCost.toFixed(2)}</Text>
            <Text style={styles.summaryUnit}>estimado</Text>
          </FadeInView>
          <FadeInView delay={160} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Potência Média</Text>
            <Text style={styles.summaryValue}>{avgPower}</Text>
            <Text style={styles.summaryUnit}>W</Text>
          </FadeInView>
        </View>

        {/* CONSUMPTION CHART */}
        <FadeInView delay={200}>
          <LineChartWidget
            data={chartData}
            peakIndex={peakIdx}
            title="Consumo de Potência"
            unit="W"
            lineColor={colors.primary}
            peakLabel="Máx"
          />
        </FadeInView>

        {/* DAILY CHART */}
        <FadeInView delay={260}>
          <BarChartWidget
            data={dailyData}
            maxIndex={maxDailyIdx}
            title="Média Diária de Consumo"
            unit="kWh"
            barColor={colors.primary}
          />
        </FadeInView>

        {/* READINGS TABLE */}
        <FadeInView delay={320} style={styles.tableSection}>
          <Text style={styles.tableTitle}>Leituras Recentes</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : readings.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma leitura disponível</Text>
          ) : (
            <>
              {/* TABLE HEADER */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colDate]}>Data</Text>
                <Text style={[styles.tableHeaderCell, styles.colVal]}>V</Text>
                <Text style={[styles.tableHeaderCell, styles.colVal]}>A</Text>
                <Text style={[styles.tableHeaderCell, styles.colVal]}>W</Text>
                <Text style={[styles.tableHeaderCell, styles.colVal]}>kWh</Text>
              </View>

              {/* TABLE ROWS */}
              {reversed.slice(-20).reverse().map((r, i) => (
                <View
                  key={r.timestamp || i}
                  style={[
                    styles.tableRow,
                    i % 2 === 1 && { backgroundColor: 'rgba(255,255,255,0.02)' },
                  ]}
                >
                  <Text style={[styles.tableCell, styles.colDate]}>
                    {formatDate(r.timestamp)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colVal]}>
                    {r.voltagem?.toFixed(1) ?? '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colVal]}>
                    {r.corrente?.toFixed(2) ?? '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colVal]}>
                    {r.potenciaAtiva?.toFixed(0) ?? '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colVal]}>
                    {r.consumokWh?.toFixed(3) ?? '-'}
                  </Text>
                </View>
              ))}
            </>
          )}
        </FadeInView>

        {/* FOOTER */}
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
  title: {
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

  /* SUMMARY */
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryUnit: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },

  /* TABLE */
  tableSection: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  tableCell: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  colDate: {
    flex: 2,
  },
  colVal: {
    flex: 1,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
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

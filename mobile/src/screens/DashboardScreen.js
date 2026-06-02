import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadeInView from '../components/FadeInView';
import KpiCard from '../components/cards/KpiCard';
import LineChartWidget from '../components/charts/LineChartWidget';
import useTelemetryData from '../hooks/useTelemetryData';
import { colors } from '../theme/colors';

/* ── Constant helpers ── */

const PERIODOS = [
  { key: '15m', label: '15 min' },
  { key: '1h', label: '1 hora' },
  { key: '6h', label: '6 horas' },
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: 'custom', label: 'Personalizado' },
];

const TIPOS_GRAFICO = [
  { key: 'all', label: 'Todos', icon: 'grid-outline' },
  { key: 'energia', label: 'Energia', icon: 'flash-outline' },
  { key: 'tensao-corrente', label: 'Tensão e Corrente', icon: 'pulse-outline' },
  { key: 'potencia', label: 'Potência', icon: 'speedometer-outline' },
  { key: 'custos', label: 'Custos', icon: 'cash-outline' },
  { key: 'qualidade', label: 'Qualidade', icon: 'shield-checkmark-outline' },
];

function getLimite(periodo) {
  switch (periodo) {
    case '15m': return 30;
    case '1h': return 120;
    case '6h': return 500;
    default: return 1000;
  }
}

/* ── Chart color palette (blue tones for EcoSense) ── */
const CHART_COLORS = {
  voltagem: '#3B82F6',
  corrente: '#60A5FA',
  potenciaAtiva: '#22C55E',
  potenciaAparente: '#2563EB',
  potenciaReativa: '#8B5CF6',
  fatorPotencia: '#06B6D4',
  frequencia: '#F59E0B',
  potenciaKw: '#10B981',
  custoHora: '#6366F1',
};

/* ── Alert component ── */
function AlertBadge({ visible, type, message }) {
  if (!visible) return null;
  const bg = type === 'danger' ? colors.dangerBg : colors.warningBg;
  const txt = type === 'danger' ? colors.danger : colors.warning;
  const icon = type === 'danger' ? 'alert-circle' : 'alert-circle-outline';
  return (
    <View style={[styles.alertBadge, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={14} color={txt} />
      <Text style={[styles.alertText, { color: txt }]}>{message}</Text>
    </View>
  );
}

/* ── Filter chip ── */
function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ── Chart type chip ── */
function ChartTypeChip({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.typeChip, active && styles.typeChipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={14}
        color={active ? colors.textPrimary : colors.textMuted}
      />
      <Text style={[styles.typeChipLabel, active && styles.typeChipLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ── Main screen ── */
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  const [periodo, setPeriodo] = useState('1h');
  const [dispositivoId, setDispositivoId] = useState('ESP32-001');
  const [tipoGrafico, setTipoGrafico] = useState('all');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [inputDevice, setInputDevice] = useState('ESP32-001');

  const limite = useMemo(() => getLimite(periodo), [periodo]);

  const {
    voltageData,
    currentData,
    activePowerData,
    apparentPowerData,
    reactivePowerData,
    powerFactorData,
    frequencyData,
    powerKwData,
    costHourData,
    voltage,
    current,
    power,
    powerKw,
    costHora,
    powerFactor,
    frequency,
    lastTimestamp,
    loading,
    error,
    refresh,
  } = useTelemetryData(dispositivoId, limite);

  /* ── Determine which charts to show ── */
  const showChart = (chartKey) => {
    if (tipoGrafico === 'all') return true;
    switch (tipoGrafico) {
      case 'energia':
        return ['potenciaAtiva', 'potenciaAparente', 'potenciaReativa'].includes(chartKey);
      case 'tensao-corrente':
        return ['voltagem', 'corrente'].includes(chartKey);
      case 'potencia':
        return ['potenciaAtiva', 'potenciaKw'].includes(chartKey);
      case 'custos':
        return ['custoHora'].includes(chartKey);
      case 'qualidade':
        return ['fatorPotencia', 'frequencia'].includes(chartKey);
      default:
        return false;
    }
  };

  const handleDeviceSubmit = () => {
    setDispositivoId(inputDevice.trim() || 'ESP32-001');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <FadeInView style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Dashboard</Text>
              <Text style={styles.subtitle}>Monitoramento em Tempo Real</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={refresh}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons
                name={loading ? 'sync' : 'refresh-outline'}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* ── PERIOD FILTER ── */}
        <FadeInView delay={40} style={styles.filterSection}>
          <Text style={styles.filterLabel}>Período</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {PERIODOS.map((p) => (
              <FilterChip
                key={p.key}
                label={p.label}
                active={periodo === p.key}
                onPress={() => setPeriodo(p.key)}
              />
            ))}
          </ScrollView>
          {periodo === 'custom' && (
            <View style={styles.dateRow}>
              <TextInput
                style={styles.dateInput}
                placeholder="Início (YYYY-MM-DD)"
                placeholderTextColor={colors.textMuted}
                value={dataInicio}
                onChangeText={setDataInicio}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="Fim (YYYY-MM-DD)"
                placeholderTextColor={colors.textMuted}
                value={dataFim}
                onChangeText={setDataFim}
              />
            </View>
          )}
        </FadeInView>

        {/* ── DEVICE FILTER ── */}
        <FadeInView delay={60} style={styles.filterSection}>
          <Text style={styles.filterLabel}>Dispositivo</Text>
          <View style={styles.deviceRow}>
            <TextInput
              style={styles.deviceInput}
              value={inputDevice}
              onChangeText={setInputDevice}
              onSubmitEditing={handleDeviceSubmit}
              placeholder="ID do dispositivo"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.deviceBtn}
              onPress={handleDeviceSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.deviceBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* ── CHART TYPE FILTER ── */}
        <FadeInView delay={80} style={styles.filterSection}>
          <Text style={styles.filterLabel}>Tipo de Gráfico</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {TIPOS_GRAFICO.map((t) => (
              <ChartTypeChip
                key={t.key}
                label={t.label}
                icon={t.icon}
                active={tipoGrafico === t.key}
                onPress={() => setTipoGrafico(t.key)}
              />
            ))}
          </ScrollView>
        </FadeInView>

        {/* ── LOADING ── */}
        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.centerText}>Carregando dados...</Text>
          </View>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <View style={styles.centerBox}>
            <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refresh} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── SUMMARY CARDS ── */}
        {!loading && !error && (
          <>
          <View style={styles.kpiRow}>
            <FadeInView delay={100} style={styles.kpiWrapper}>
              <KpiCard
                icon="flash-outline" iconColor={CHART_COLORS.voltagem}
                bgColor={`${CHART_COLORS.voltagem}20`}
                label="Tensão" value={voltage?.toFixed(1)} unit="V"
                subtitle="Atual" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
            <FadeInView delay={130} style={styles.kpiWrapper}>
              <KpiCard
                icon="speedometer-outline" iconColor={CHART_COLORS.corrente}
                bgColor={`${CHART_COLORS.corrente}20`}
                label="Corrente" value={current?.toFixed(1)} unit="A"
                subtitle="Atual" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
          </View>
          <View style={styles.kpiRow}>
            <FadeInView delay={160} style={styles.kpiWrapper}>
              <KpiCard
                icon="pulse-outline" iconColor={CHART_COLORS.potenciaAtiva}
                bgColor={`${CHART_COLORS.potenciaAtiva}20`}
                label="Potência" value={power?.toFixed(1)} unit="W"
                subtitle="Atual" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
            <FadeInView delay={190} style={styles.kpiWrapper}>
              <KpiCard
                icon="battery-charging-outline" iconColor={CHART_COLORS.potenciaKw}
                bgColor={`${CHART_COLORS.potenciaKw}20`}
                label="Potência" value={powerKw?.toFixed(3)} unit="kW"
                subtitle="Atual" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
          </View>
          <View style={styles.kpiRow}>
            <FadeInView delay={220} style={styles.kpiWrapper}>
              <KpiCard
                icon="cash-outline" iconColor={CHART_COLORS.custoHora}
                bgColor={`${CHART_COLORS.custoHora}20`}
                label="Custo por Hora" value={`R$ ${costHora?.toFixed(2)}`}
                subtitle="Atual" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
            <FadeInView delay={250} style={styles.kpiWrapper}>
              <KpiCard
                icon="checkmark-circle-outline" iconColor={CHART_COLORS.fatorPotencia}
                bgColor={`${CHART_COLORS.fatorPotencia}20`}
                label="Fator Potência" value={powerFactor?.toFixed(2)}
                subtitle={powerFactor < 0.8 ? 'Atenção!' : 'OK'}
                subtitleColor={powerFactor < 0.8 ? colors.danger : colors.success}
              />
            </FadeInView>
          </View>
          <View style={styles.kpiRow}>
            <FadeInView delay={280} style={styles.kpiWrapper}>
              <KpiCard
                icon="trending-up-outline" iconColor={CHART_COLORS.frequencia}
                bgColor={`${CHART_COLORS.frequencia}20`}
                label="Frequência" value={frequency?.toFixed(1)} unit="Hz"
                subtitle={frequency < 58 || frequency > 62 ? 'Fora do padrão' : 'Normal'}
                subtitleColor={frequency < 58 || frequency > 62 ? colors.danger : colors.success}
              />
            </FadeInView>
            <FadeInView delay={310} style={styles.kpiWrapper}>
              <KpiCard
                icon="time-outline" iconColor={colors.textMuted}
                bgColor="rgba(100,116,139,0.12)"
                label="Última Leitura" value={lastTimestamp}
                subtitle="" subtitleColor={colors.textSecondary}
              />
            </FadeInView>
          </View>

          {/* ── CHARTS ── */}

          {/* 1. Tensão */}
          {showChart('voltagem') && voltageData.length > 0 && (
            <FadeInView delay={340}>
              <LineChartWidget
                data={voltageData}
                peakIndex={-1}
                title="Tensão"
                unit="V"
                lineColor={CHART_COLORS.voltagem}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 2. Corrente */}
          {showChart('corrente') && currentData.length > 0 && (
            <FadeInView delay={370}>
              <LineChartWidget
                data={currentData}
                peakIndex={-1}
                title="Corrente"
                unit="A"
                lineColor={CHART_COLORS.corrente}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 3. Potência Ativa */}
          {showChart('potenciaAtiva') && activePowerData.length > 0 && (
            <FadeInView delay={400}>
              <LineChartWidget
                data={activePowerData}
                peakIndex={-1}
                title="Potência Ativa"
                unit="W"
                lineColor={CHART_COLORS.potenciaAtiva}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 4. Potência Aparente */}
          {showChart('potenciaAparente') && apparentPowerData.length > 0 && (
            <FadeInView delay={430}>
              <LineChartWidget
                data={apparentPowerData}
                peakIndex={-1}
                title="Potência Aparente"
                unit="VA"
                lineColor={CHART_COLORS.potenciaAparente}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 5. Potência Reativa */}
          {showChart('potenciaReativa') && reactivePowerData.length > 0 && (
            <FadeInView delay={460}>
              <LineChartWidget
                data={reactivePowerData}
                peakIndex={-1}
                title="Potência Reativa"
                unit="VAR"
                lineColor={CHART_COLORS.potenciaReativa}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 6. Fator de Potência + Alerta */}
          {showChart('fatorPotencia') && powerFactorData.length > 0 && (
            <FadeInView delay={490}>
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Fator de Potência</Text>
                  <Text style={styles.chartUnit}>0 – 1</Text>
                </View>
                <AlertBadge
                  visible={powerFactor < 0.8}
                  type="danger"
                  message={`Fator de potência abaixo de 0,8 (${powerFactor?.toFixed(2)})`}
                />
                <LineChartWidget
                  data={powerFactorData}
                  peakIndex={-1}
                  title=""
                  unit=""
                  lineColor={CHART_COLORS.fatorPotencia}
                  peakLabel=""
                />
              </View>
            </FadeInView>
          )}

          {/* 7. Frequência + Alerta */}
          {showChart('frequencia') && frequencyData.length > 0 && (
            <FadeInView delay={520}>
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Frequência</Text>
                  <Text style={styles.chartUnit}>Hz</Text>
                </View>
                <AlertBadge
                  visible={frequency < 58 || frequency > 62}
                  type="warning"
                  message={`Frequência fora do ideal (${frequency?.toFixed(1)} Hz) — ideal: 60 Hz`}
                />
                <LineChartWidget
                  data={frequencyData}
                  peakIndex={-1}
                  title=""
                  unit="Hz"
                  lineColor={CHART_COLORS.frequencia}
                  peakLabel=""
                />
              </View>
            </FadeInView>
          )}

          {/* 8. Potência em kW */}
          {showChart('potenciaKw') && powerKwData.length > 0 && (
            <FadeInView delay={550}>
              <LineChartWidget
                data={powerKwData}
                peakIndex={-1}
                title="Potência em kW"
                unit="kW"
                lineColor={CHART_COLORS.potenciaKw}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* 9. Custo por Hora */}
          {showChart('custoHora') && costHourData.length > 0 && (
            <FadeInView delay={580}>
              <LineChartWidget
                data={costHourData}
                peakIndex={-1}
                title="Custo por Hora"
                unit="R$"
                lineColor={CHART_COLORS.custoHora}
                peakLabel="Máx"
              />
            </FadeInView>
          )}

          {/* ── FOOTER ── */}
          <FadeInView delay={610} style={styles.footer}>
            <Text style={styles.footerText}>
              EcoSense © {new Date().getFullYear()} — Monitoramento Inteligente de Energia
            </Text>
          </FadeInView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
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
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Filters */
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: `${colors.secondary}25`,
    borderColor: colors.secondary,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipLabelActive: {
    color: colors.secondary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textPrimary,
  },
  deviceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  deviceInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textPrimary,
  },
  deviceBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  /* Chart type chips */
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  typeChipActive: {
    backgroundColor: `${colors.secondary}25`,
    borderColor: colors.secondary,
  },
  typeChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  typeChipLabelActive: {
    color: colors.textPrimary,
  },

  /* KPI cards */
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  kpiWrapper: {
    flex: 1,
    minWidth: 0,
  },

  /* Center / Error */
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  centerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  /* Chart card wrapper (for charts with alerts) */
  chartCard: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 0,
    marginHorizontal: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chartUnit: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },

  /* Alert badge */
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },

  /* Footer */
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

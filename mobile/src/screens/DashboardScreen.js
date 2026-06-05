import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPIEnergyBar from '../components/dashboard/KPIEnergyBar';
import FilterBar from '../components/dashboard/FilterBar';
import TimeSeriesChart from '../components/dashboard/TimeSeriesChart';
import ShiftConsumption from '../components/dashboard/ShiftConsumption';
import ForecastChart from '../components/dashboard/ForecastChart';
import BoxPlotChart from '../components/dashboard/BoxPlotChart';
import useDashboardData from '../hooks/useDashboardData';
import { colors } from '../theme/colors';

function Skeleton({ width: w, height: h, style }) {
  return <View style={[{ width: w, height: h, borderRadius: 8, backgroundColor: colors.borderLight }, style]} />;
}

function SkeletonGroup() {
  return (
    <View style={styles.skeletonWrap}>
      <Skeleton width={'100%'} height={110} style={styles.skelRow} />
      <View style={styles.skelPair}>
        <Skeleton width={'100%'} height={260} />
        <Skeleton width={'100%'} height={260} />
      </View>
      <Skeleton width={'100%'} height={220} style={styles.skelRow} />
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const {
    kpis,
    graficoLinha,
    dateRange,
    setDateRange,
    refreshing,
    handleRefresh,
    lastUpdate,
    status,
  } = useDashboardData();

  const loading = kpis.loading || graficoLinha.loading;
  const error = graficoLinha.error;
  const data = graficoLinha.data || [];
  const showCharts = !loading && !error;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          status={status}
          lastUpdate={lastUpdate}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="cloud-offline-outline" size={36} color={colors.danger} />
            <Text style={styles.errorTitle}>Erro ao conectar com o servidor</Text>
            <Text style={styles.errorDetail}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={14} color={colors.textPrimary} />
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <KPIEnergyBar
              preditiva={kpis.data?.preditiva}
              voltageStats={kpis.data?.descritiva?.voltagem}
              loading={loading}
            />

            {showCharts ? (
              <FilterBar
                readings={data}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            ) : null}

            {loading ? (
              <SkeletonGroup />
            ) : data.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhuma leitura encontrada no período</Text>
                <Text style={styles.emptyHint}>
                  Tente selecionar um período maior ou limpar os filtros.
                </Text>
              </View>
            ) : (
              <>
                <TimeSeriesChart readings={data} />

                <View style={styles.chartsPair}>
                  <ShiftConsumption
                    consumoPorTurno={kpis.data?.estratificada?.consumoPorTurno}
                  />
                  <ForecastChart preditiva={kpis.data?.preditiva} />
                </View>

                <BoxPlotChart descritiva={kpis.data?.descritiva} field="corrente" label="Corrente" />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    EcoSense © {new Date().getFullYear()} — Monitoramento Inteligente de Energia
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },
  errorBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.danger}33`,
  },
  errorTitle: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  retryText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  emptyHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  skeletonWrap: { marginTop: 8 },
  skelRow: { marginHorizontal: 20, marginVertical: 8 },
  skelPair: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  chartsPair: { paddingHorizontal: 0 },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: colors.textInactive,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

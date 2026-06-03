import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPIEnergyBar from "../../components/dashboard/KPIEnergyBar/KPIEnergyBar";
import TimeSeriesChart from "../../components/dashboard/TimeSeriesChart/TimeSeriesChart";
import ShiftConsumption from "../../components/dashboard/ShiftConsumption/ShiftConsumption";
import ForecastChart from "../../components/dashboard/ForecastChart/ForecastChart";
import BoxPlotChart from "../../components/dashboard/BoxPlotChart/BoxPlotChart";
import FilterBar from "../../components/dashboard/FilterBar/FilterBar";
import { fetchTelemetria, fetchEstatisticas } from "../../services/telemetriaService";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [kpis, setKpis] = useState({ loading: true, error: null, data: null });
  const [graficoLinha, setGraficoLinha] = useState({ loading: true, error: null, data: [], meta: null });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refreshing, setRefreshing] = useState(false);

  const loadKpis = useCallback(async () => {
    setKpis(prev => ({ ...prev, loading: true }));
    try {
      const data = await fetchEstatisticas();
      setKpis({ loading: false, error: null, data });
    } catch (err) {
      setKpis({ loading: false, error: err.message || "Erro ao carregar estatísticas", data: null });
    }
  }, []);

  const loadGraficoLinha = useCallback(async ({ start, end } = {}) => {
    setGraficoLinha(prev => ({ ...prev, loading: true }));
    try {
      const result = await fetchTelemetria(undefined, 1000, start, end);
      const data = result?.history || [];
      const meta = result?.insights || null;
      setGraficoLinha({ loading: false, error: null, data, meta });
    } catch (err) {
      const is404 = err.message?.includes("404");
      setGraficoLinha(prev => ({
        loading: false,
        error: is404 ? null : (err.message || "Erro ao carregar dados"),
        data: is404 ? [] : prev.data,
        meta: is404 ? prev.meta : null,
      }));
    }
  }, []);

  useEffect(() => {
    loadKpis();
    loadGraficoLinha();
  }, [loadKpis, loadGraficoLinha]);

  useEffect(() => {
    loadKpis();
    if (dateRange.start || dateRange.end) loadGraficoLinha(dateRange);
  }, [dateRange, loadKpis, loadGraficoLinha]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadKpis(),
      loadGraficoLinha(dateRange.start || dateRange.end ? dateRange : undefined),
    ]);
    setRefreshing(false);
  }, [loadKpis, loadGraficoLinha, dateRange]);

  const lastReading = graficoLinha.data?.[graficoLinha.data.length - 1];
  const lastUpdate = lastReading?.timestamp
    ? new Date(lastReading.timestamp).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";
  const status = (graficoLinha.data?.length || 0) > 0 ? "online" : "offline";

  if (graficoLinha.error && !graficoLinha.loading) {
    return (
      <motion.section className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className={styles.header}>
          <DashboardHeader status="offline" />
        </div>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <p className={styles.errorText}>Erro ao conectar com o servidor</p>
          <span className={styles.errorDetail}>{graficoLinha.error}</span>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.header}>
        <DashboardHeader
          status={status}
          lastUpdate={lastUpdate}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </div>

      <KPIEnergyBar
        preditiva={kpis.data?.preditiva}
        voltageStats={kpis.data?.descritiva?.voltagem}
        loading={kpis.loading || graficoLinha.loading}
      />

      <FilterBar
        readings={graficoLinha.data}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {graficoLinha.loading ? (
        <div className={styles.chartsGrid}>
          <div className={styles.skelRow}>
            <div className={styles.skelBlock} />
          </div>
          <div className={styles.skelRow2}>
            <div className={styles.skelBlock} />
            <div className={styles.skelBlock} />
          </div>
          <div className={styles.skelRow}>
            <div className={styles.skelBlock} />
          </div>
        </div>
      ) : (graficoLinha.data?.length || 0) === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>Nenhuma leitura encontrada no período</p>
          <p className={styles.emptyHint}>Tente selecionar um período maior ou limpar os filtros.</p>
        </div>
      ) : (
        <div className={styles.chartsGrid}>
          <TimeSeriesChart readings={graficoLinha.data} delay={0} />

          <div className={styles.chartsPair}>
            <ShiftConsumption consumoPorTurno={kpis.data?.estratificada?.consumoPorTurno} delay={0.1} />
            <ForecastChart preditiva={kpis.data?.preditiva} delay={0.1} />
          </div>

          <BoxPlotChart descritiva={kpis.data?.descritiva} delay={0.2} />
        </div>
      )}
    </motion.section>
  );
}

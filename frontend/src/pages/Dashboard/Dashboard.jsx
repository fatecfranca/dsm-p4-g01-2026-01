import { useState, useEffect, useCallback, useRef } from "react";
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
  const [telState, setTelState] = useState({ loading: true, error: null, data: [], meta: null });
  const [estatState, setEstatState] = useState({ loading: true, data: null });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refreshing, setRefreshing] = useState(false);
  const estatFetched = useRef(false);

  const loadEstatisticas = useCallback(async () => {
    if (estatFetched.current) return;
    estatFetched.current = true;
    try {
      const result = await fetchEstatisticas();
      setEstatState({ loading: false, data: result });
    } catch {
      setEstatState({ loading: false, data: null });
    }
  }, []);

  const loadTelemetria = useCallback(async ({ start, end } = {}) => {
    try {
      const { data, meta } = await fetchTelemetria(undefined, 1000, start, end);
      setTelState({ loading: false, error: null, data, meta });
    } catch (err) {
      const is404 = err.message?.includes("404");
      setTelState(prev => ({
        loading: false,
        error: is404 ? null : (err.message || "Erro ao carregar dados"),
        data: [],
        meta: is404 ? prev.meta : null,
      }));
    }
  }, []);

  useEffect(() => {
    loadEstatisticas();
    loadTelemetria();
    const interval = setInterval(() => loadTelemetria(), 30000);
    return () => clearInterval(interval);
  }, [loadEstatisticas, loadTelemetria]);

  useEffect(() => {
    if (dateRange.start || dateRange.end) loadTelemetria(dateRange);
  }, [dateRange, loadTelemetria]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTelemetria(dateRange.start || dateRange.end ? dateRange : undefined);
    setRefreshing(false);
  }, [loadTelemetria, dateRange]);

  const { loading, error, data, meta } = telState;
  const { loading: estatLoading, data: estatData } = estatState;

  const latest = meta?.latest || {};
  const lastUpdate = latest?.dataHoraBrasil || "—";
  const status = data.length > 0 ? "online" : "offline";

  const preditiva = estatData?.preditiva || meta?.preditiva || {};
  const descritiva = {
    ...(meta?.descritiva || {}),
    ...(estatData?.descritiva || {}),
  };
  const descritivaBase = meta?.descritiva || {};
  const estratificada = {
    ...(meta?.estratificada || {}),
    ...(estatData?.estratificada || {}),
  };

  if (error && !loading) {
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
          <span className={styles.errorDetail}>{error}</span>
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
        preditiva={preditiva}
        voltageStats={descritiva.voltagem}
        loading={loading || estatLoading}
      />

      <FilterBar
        readings={data}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {loading ? (
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
      ) : data.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>Nenhuma leitura encontrada no período</p>
          <p className={styles.emptyHint}>Tente selecionar um período maior ou limpar os filtros.</p>
        </div>
      ) : (
        <div className={styles.chartsGrid}>
          <TimeSeriesChart readings={data} delay={0} />

          <div className={styles.chartsPair}>
            <ShiftConsumption consumoPorTurno={estratificada.consumoPorTurno} delay={0.1} />
            <ForecastChart preditiva={preditiva} delay={0.1} />
          </div>

          <BoxPlotChart descritiva={descritiva} descritivaBase={descritivaBase} delay={0.2} />
        </div>
      )}
    </motion.section>
  );
}

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import MetricChart from "../../components/dashboard/MetricChart/MetricChart";
import FilterBar from "../../components/dashboard/FilterBar/FilterBar";
import { fetchTelemetria } from "../../services/telemetriaService";
import { colors } from "../../theme/colors";
import { validateData } from "../../utils/validateData";
import styles from "./Dashboard.module.css";

function formatTimeBR(ts) {
  const d = new Date(ts);
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function inRange(ts, start, end) {
  if (!start && !end) return true;
  const t = ts.slice(0, 10);
  if (start && t < start) return false;
  if (end && t > end) return false;
  return true;
}

export default function Dashboard() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    readings: null,
  });

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchTelemetria();
      setState({ loading: false, error: null, readings: data });
      if (import.meta.env.DEV) validateData(data);
    } catch (err) {
      setState(prev => ({
        loading: false,
        error: err.message || "Erro ao carregar dados",
        readings: prev.readings,
      }));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
      if (!mounted) return;
    })();
    const interval = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, [load]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const { loading, error, readings } = state;

  const latest = useMemo(() => {
    if (!readings || readings.length === 0) return {};
    const sorted = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return sorted[sorted.length - 1];
  }, [readings]);

  const lastUpdate = latest?.dataHoraBrasil || (latest?.timestamp ? formatTimeBR(latest.timestamp) : "—");
  const status = readings && readings.length > 0 ? "online" : "offline";

  // Filter readings by date range
  const processedReadings = useMemo(() => {
    if (!readings || readings.length === 0) return [];
    return readings.filter(r => inRange(r.timestamp, dateRange.start, dateRange.end));
  }, [readings, dateRange]);

  const visibleCount = processedReadings.length;
  const totalCount = readings?.length || 0;

  if (error) {
    return (
      <motion.section className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className={styles.header}>
          <DashboardHeader status="offline" />
        </div>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>!</span>
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

      <KPICards readings={latest} loading={loading} />

      <FilterBar
        readings={readings || []}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {loading ? (
        <div className={styles.chartsRow}>
          <MetricChart loading />
          <MetricChart loading />
          <MetricChart loading />
        </div>
      ) : processedReadings.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>Nenhuma leitura encontrada no período</p>
          <p className={styles.emptyHint}>Tente selecionar um período maior ou limpar os filtros.</p>
        </div>
      ) : (
        <div className={styles.chartsRow}>
          <div className={styles.chartInfo}>
            {visibleCount < totalCount && (
              <span className={styles.filterInfo}>
                Mostrando {visibleCount} de {totalCount} leituras
              </span>
            )}
          </div>
          <MetricChart
            readings={processedReadings}
            field="voltagem"
            label="Tensão"
            unit="V"
            color={colors.primary}
            thresholds={{ min: 0, max: 300 }}
            delay={0}
          />
          <MetricChart
            readings={processedReadings}
            field="corrente"
            label="Corrente"
            unit="A"
            color={colors.info}
            thresholds={{ min: 0, max: 10 }}
            delay={0.08}
          />
          <MetricChart
            readings={processedReadings}
            field="potenciaAtiva"
            label="Potência Ativa"
            unit="W"
            color={colors.warning}
            thresholds={{ min: -100, max: 500 }}
            delay={0.16}
          />
        </div>
      )}
    </motion.section>
  );
}

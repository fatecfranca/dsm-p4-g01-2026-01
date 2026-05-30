import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import MetricChart from "../../components/dashboard/MetricChart/MetricChart";
import FilterBar from "../../components/dashboard/FilterBar/FilterBar";
import { fetchTelemetria } from "../../services/telemetriaService";
import { colors } from "../../theme/colors";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: [],
    meta: null,
  });

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async ({ start, end } = {}) => {
    try {
      const { data, meta } = await fetchTelemetria(undefined, 1000, start, end);
      setState({ loading: false, error: null, data, meta });
    } catch (err) {
      setState(prev => ({
        loading: false,
        error: err.message || "Erro ao carregar dados",
        data: [],
        meta: err.message?.includes("404") ? null : prev.meta,
      }));
    }
  }, []);

  useEffect(() => {
    (async () => { await load(); })();
    const interval = setInterval(() => load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (dateRange.start || dateRange.end) {
      load(dateRange);
    }
  }, [dateRange, load]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(dateRange.start || dateRange.end ? dateRange : undefined);
    setRefreshing(false);
  }, [load, dateRange]);

  const { loading, error, data, meta } = state;
  const latest = meta?.latest || {};
  const lastUpdate = latest?.dataHoraBrasil || "—";
  const status = data.length > 0 ? "online" : "offline";

  if (error && !loading) {
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

  const charts = [
    { field: "voltagem", label: "Tensão", unit: "V", color: colors.primary, delay: 0 },
    { field: "corrente", label: "Corrente", unit: "A", color: colors.info, delay: 0.08 },
    { field: "potenciaAtiva", label: "Potência Ativa", unit: "W", color: colors.warning, delay: 0.16 },
  ];

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
        readings={data}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {loading ? (
        <div className={styles.chartsRow}>
          <MetricChart loading />
          <MetricChart loading />
          <MetricChart loading />
        </div>
      ) : data.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>Nenhuma leitura encontrada no período</p>
          <p className={styles.emptyHint}>Tente selecionar um período maior ou limpar os filtros.</p>
        </div>
      ) : (
        <div className={styles.chartsRow}>
          <div className={styles.chartInfo}>
            <span className={styles.filterInfo}>
              {data.length} leitura{(data.length !== 1 ? "s" : "")}
            </span>
          </div>
          {charts.map((c) => (
            <MetricChart
              key={c.field}
              readings={data}
              field={c.field}
              label={c.label}
              unit={c.unit}
              color={c.color}
              stats={meta?.descritiva?.[c.field]}
              insight={meta?.insights?.[c.field]}
              delay={c.delay}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

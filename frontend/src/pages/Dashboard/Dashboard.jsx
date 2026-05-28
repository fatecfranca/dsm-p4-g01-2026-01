import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import MetricChart from "../../components/dashboard/MetricChart/MetricChart";
import FilterBar from "../../components/dashboard/FilterBar/FilterBar";
import { fetchTelemetria } from "../../services/telemetriaService";
import { colors } from "../../theme/colors";
import styles from "./Dashboard.module.css";

function formatTimeBR(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function inRange(ts, start, end) {
  if (!start && !end) return true;
  const t = ts.slice(0, 10);
  if (start && t < start) return false;
  if (end && t > end) return false;
  return true;
}

function aggregateBy(readings, mode) {
  if (!readings || readings.length === 0 || mode === "raw") return readings;

  const groups = {};
  readings.forEach(r => {
    const key = mode === "hour"
      ? r.timestamp.slice(0, 13)
      : r.timestamp.slice(0, 10);

    if (!groups[key]) {
      groups[key] = {
        ...r,
        _count: 1,
        _sumVoltagem: r.voltagem,
        _sumCorrente: r.corrente,
        _sumPotencia: r.potenciaAtiva,
        _sumCusto: r.custoReais || 0,
      };
    } else {
      const g = groups[key];
      g._count++;
      g._sumVoltagem += r.voltagem;
      g._sumCorrente += r.corrente;
      g._sumPotencia += r.potenciaAtiva;
      g._sumCusto += r.custoReais || 0;
    }
  });

  return Object.values(groups).map(g => ({
    dispositivoId: g.dispositivoId,
    voltagem: g._sumVoltagem / g._count,
    corrente: g._sumCorrente / g._count,
    potenciaAtiva: g._sumPotencia / g._count,
    custoReais: g._sumCusto / g._count,
    timestamp: g.timestamp,
  }));
}

export default function Dashboard() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    readings: null,
  });

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [granularity, setGranularity] = useState("raw");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchTelemetria();
        if (!mounted) return;
        setState({ loading: false, error: null, readings: data });
      } catch (err) {
        if (!mounted) return;
        setState({ loading: false, error: err.message || "Erro ao carregar dados", readings: null });
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const { loading, error, readings } = state;

  const latest = useMemo(() => {
    if (!readings || readings.length === 0) return {};
    const sorted = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return sorted[sorted.length - 1];
  }, [readings]);

  const lastUpdate = latest?.dataHoraBrasil || (latest?.timestamp ? formatTimeBR(latest.timestamp) : "—");
  const status = readings && readings.length > 0 ? "online" : "offline";

  // Filter + aggregate
  const processedReadings = useMemo(() => {
    if (!readings || readings.length === 0) return [];
    const filtered = readings.filter(r => inRange(r.timestamp, dateRange.start, dateRange.end));
    return aggregateBy(filtered, granularity);
  }, [readings, dateRange, granularity]);

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
        <DashboardHeader status={status} lastUpdate={lastUpdate} />
      </div>

      <KPICards readings={latest} loading={loading} />

      <FilterBar
        readings={readings || []}
        dateRange={dateRange}
        granularity={granularity}
        onDateRangeChange={setDateRange}
        onGranularityChange={setGranularity}
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
                {granularity !== "raw" && ` · Agrupado por ${granularity === "hour" ? "hora" : "dia"}`}
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

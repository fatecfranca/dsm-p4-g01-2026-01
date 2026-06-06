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
import { useTelemetrySocket } from "../../hooks/useTelemetrySocket";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Dashboard.module.css";

function isInRange(timestamp, start, end) {
  if (!timestamp) return false;
  const t = new Date(timestamp);
  if (start) {
    const s = new Date(`${start}T00:00:00`);
    if (t < s) return false;
  }
  if (end) {
    const e = new Date(`${end}T23:59:59.999`);
    if (t > e) return false;
  }
  return true;
}

function SkeletonChart({ height = 220 }) {
  return <div className={styles.skelBlock} style={{ height }} />;
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [kpis, setKpis] = useState({ loading: true, error: null, data: null });
  const [graficoLinha, setGraficoLinha] = useState({
    loading: true,
    error: null,
    data: [],
    meta: null,
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refreshing, setRefreshing] = useState(false);
  const [liveReading, setLiveReading] = useState(null);

  const loadKpis = useCallback(async () => {
    setKpis((prev) => ({ ...prev, loading: true }));
    try {
      const data = await fetchEstatisticas();
      setKpis({ loading: false, error: null, data });
    } catch (err) {
      setKpis({
        loading: false,
        error: err.message || "Erro ao carregar estatísticas",
        data: null,
      });
    }
  }, []);

  const loadGraficoLinha = useCallback(async ({ start, end } = {}) => {
    setGraficoLinha((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchTelemetria(undefined, 1000, start, end);
      const data = result?.history || [];
      const meta = result?.insights || null;
      setGraficoLinha({ loading: false, error: null, data, meta });
    } catch (err) {
      const is404 = err.message?.includes("404");
      setGraficoLinha((prev) => ({
        loading: false,
        error: is404 ? null : err.message || "Erro ao carregar dados",
        data: is404 ? [] : prev.data,
        meta: is404 ? prev.meta : null,
      }));
    }
  }, []);

  useEffect(() => {
    loadKpis();
    const params = dateRange.start || dateRange.end ? dateRange : undefined;
    loadGraficoLinha(params);
  }, [dateRange, loadKpis, loadGraficoLinha]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const params = dateRange.start || dateRange.end ? dateRange : undefined;
    await Promise.all([loadKpis(), loadGraficoLinha(params)]);
    setRefreshing(false);
  }, [loadKpis, loadGraficoLinha, dateRange]);

  const { connected: wsConnected } = useTelemetrySocket({
    enabled: isAuthenticated,
    onLeitura: (dados) => {
      setLiveReading(dados);
      setGraficoLinha((prev) => {
        if (prev.data.length === 0) return prev;
        const last = prev.data[prev.data.length - 1];
        if (last && last.timestamp === dados.timestamp) return prev;
        if (!isInRange(dados.timestamp, dateRange.start, dateRange.end)) return prev;
        return { ...prev, data: [...prev.data, dados] };
      });
    },
  });

  const filteredLast = graficoLinha.data?.[graficoLinha.data.length - 1];
  const lastReading = liveReading && isInRange(liveReading.timestamp, dateRange.start, dateRange.end)
    ? liveReading
    : filteredLast;

  const lastUpdate = lastReading?.timestamp
    ? new Date(lastReading.timestamp).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const status = (graficoLinha.data?.length || 0) > 0 ? "online" : "offline";
  const hasFilter = !!(dateRange.start || dateRange.end);

  if (graficoLinha.error && !graficoLinha.loading) {
    return (
      <motion.section
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.header}>
          <DashboardHeader status="offline" live={false} />
        </div>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
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
          live={wsConnected && isAuthenticated}
        />
      </div>

      <div className={styles.filter}>
        <FilterBar
          readings={graficoLinha.data}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <KPIEnergyBar
        preditiva={kpis.data?.preditiva}
        voltageStats={kpis.data?.descritiva?.voltagem}
        fatorPotenciaStats={kpis.data?.descritiva?.fatorPotencia}
        frequenciaStats={kpis.data?.descritiva?.frequencia}
        loading={kpis.loading}
        lastReading={lastReading}
      />

      {graficoLinha.loading ? (
        <div className={styles.chartsGrid}>
          <SkeletonChart height={360} />
          <div className={styles.chartsPair}>
            <SkeletonChart height={280} />
            <SkeletonChart height={280} />
          </div>
          <SkeletonChart height={320} />
        </div>
      ) : (graficoLinha.data?.length || 0) === 0 ? (
        <div className={styles.emptyBox}>
          <EmptyState hasFilter={hasFilter} onClear={() => setDateRange({ start: "", end: "" })} />
        </div>
      ) : (
        <div className={styles.chartsGrid}>
          <TimeSeriesChart readings={graficoLinha.data} delay={0} />

          <div className={styles.chartsPair}>
            <ShiftConsumption
              consumoPorTurno={kpis.data?.estratificada?.consumoPorTurno}
              delay={0.1}
            />
            <ForecastChart preditiva={kpis.data?.preditiva} delay={0.1} />
          </div>

          <BoxPlotChart descritiva={kpis.data?.descritiva} delay={0.2} />
        </div>
      )}
    </motion.section>
  );
}

function EmptyState({ hasFilter, onClear }) {
  return (
    <div className={styles.emptyInner}>
      <div className={styles.emptyArt}>
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emptyStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <rect x="40" y="30" width="120" height="80" rx="10" stroke="url(#emptyStroke)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="55" y1="55" x2="145" y2="55" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
          <line x1="55" y1="70" x2="120" y2="70" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
          <line x1="55" y1="85" x2="100" y2="85" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
          <circle cx="100" cy="70" r="22" fill="rgba(34,197,94,0.06)" />
          <circle cx="100" cy="70" r="22" stroke="var(--color-primary)" strokeWidth="1.5" />
          <line x1="100" y1="58" x2="100" y2="72" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="78" x2="100.01" y2="78" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>Nenhuma leitura no período</h3>
      <p className={styles.emptyText}>
        {hasFilter
          ? "Não encontramos dados para o intervalo selecionado."
          : "O sensor ainda não enviou nenhuma leitura."}
      </p>
      {hasFilter && (
        <button className={styles.emptyBtn} onClick={onClear}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Ver todas as leituras
        </button>
      )}
    </div>
  );
}

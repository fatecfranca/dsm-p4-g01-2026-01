import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import LineChart from "../../components/dashboard/LineChart/LineChart";
import CostTrend from "../../components/dashboard/CostTrend/CostTrend";
import EnergyAnalysis from "../../components/dashboard/EnergyAnalysis/EnergyAnalysis";
import GaugeSection from "../../components/dashboard/GaugeSection/GaugeSection";
import DistributionChart from "../../components/dashboard/DistributionChart/DistributionChart";
import BarChart from "../../components/dashboard/BarChart/BarChart";
import { fetchTelemetria } from "../../services/telemetriaService";
import styles from "./Dashboard.module.css";

function formatHour(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatTimeBR(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Outlier thresholds based on sensor analysis
const OUTLIER_THRESHOLDS = {
  voltagem: { max: 300 },
  corrente: { max: 10 },
  potenciaAtiva: { min: -100, max: 500 },
};

function isCleanReading(r) {
  return (
    (r.voltagem ?? 0) < OUTLIER_THRESHOLDS.voltagem.max &&
    (r.corrente ?? 0) < OUTLIER_THRESHOLDS.corrente.max &&
    (r.potenciaAtiva ?? 0) > OUTLIER_THRESHOLDS.potenciaAtiva.min &&
    (r.potenciaAtiva ?? 0) < OUTLIER_THRESHOLDS.potenciaAtiva.max
  );
}

function processReadings(readings) {
  if (!readings || readings.length === 0) {
    return { latest: {}, timeSeries: [], dailyConsumption: [], status: "offline", lastUpdate: "—" };
  }

  const sorted = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // BUG FIX: use most-recent reading (last in ASC-sorted array), not readings[0]
  const latest = sorted[sorted.length - 1];

  const timeSeries = sorted.map((r) => ({
    time: formatHour(r.timestamp),
    power: r.potenciaAtiva ?? 0,
  }));

  const dailyMap = {};
  readings.forEach((r) => {
    const d = new Date(r.timestamp);
    const day = DAY_NAMES[d.getDay()];
    if (!dailyMap[day]) dailyMap[day] = [];
    const kwh = r.consumokWh ?? 0;
    if (kwh > 0) dailyMap[day].push(kwh); // only positive values
  });

  const dailyConsumption = DAY_NAMES.map((day) => {
    const vals = dailyMap[day] || [];
    const total = vals.reduce((a, b) => a + b, 0);
    return { day, consumption: +total.toFixed(3) };
  }).filter((d) => d.consumption > 0);

  return {
    latest,
    timeSeries,
    dailyConsumption,
    status: "online",
    lastUpdate: latest.dataHoraBrasil || formatTimeBR(latest.timestamp),
  };
}

export default function Dashboard() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    readings: null,
    processed: null,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchTelemetria();
        if (!mounted) return;
        setState({
          loading: false,
          error: null,
          readings: data,
          processed: processReadings(data),
        });
      } catch (err) {
        if (!mounted) return;
        setState({
          loading: false,
          error: err.message || "Erro ao carregar dados",
          readings: null,
          processed: null,
        });
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const { loading, error, processed, readings } = state;

  // Cleaned readings: outliers removed for charts that use raw readings
  const cleanedReadings = useMemo(
    () => (readings ? readings.filter(isCleanReading) : []),
    [readings]
  );

  if (error) {
    return (
      <motion.section
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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

  const latest = processed?.latest || {};
  const timeSeries = processed?.timeSeries || [];
  const dailyConsumption = processed?.dailyConsumption || [];

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <DashboardHeader
          status={processed?.status || "offline"}
          lastUpdate={processed?.lastUpdate || "—"}
        />
      </div>

      {/* KPI row — KPICards renders its own 4-col grid */}
      <KPICards readings={latest} loading={loading} />

      {/* Primary row — LineChart 2fr | (CostTrend + EnergyAnalysis) 1fr */}
      <div className={styles.primary}>
        <div className={styles.chartCard}>
          <LineChart data={timeSeries} loading={loading} />
        </div>
        <div className={styles.analyticsCol}>
          <div className={styles.chartCard}>
            <CostTrend data={timeSeries} loading={loading} />
          </div>
          <div className={styles.chartCard}>
            <EnergyAnalysis readings={cleanedReadings} loading={loading} />
          </div>
        </div>
      </div>

      {/* Secondary row — GaugeSection | DistributionChart */}
      <div className={styles.secondary}>
        <div className={styles.chartCard}>
          <GaugeSection readings={latest} loading={loading} />
        </div>
        <div className={styles.chartCard}>
          <DistributionChart readings={cleanedReadings} loading={loading} />
        </div>
      </div>

      {/* Tertiary row — Daily consumption bar chart (full width) */}
      <div className={styles.tertiary}>
        <div className={styles.chartCard}>
          <BarChart data={dailyConsumption} loading={loading} />
        </div>
      </div>
    </motion.section>
  );
}

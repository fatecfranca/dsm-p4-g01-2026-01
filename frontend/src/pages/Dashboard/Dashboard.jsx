import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import LineChart from "../../components/dashboard/LineChart/LineChart";
import CostTrend from "../../components/dashboard/CostTrend/CostTrend";
import EnergyAnalysis from "../../components/dashboard/EnergyAnalysis/EnergyAnalysis";
import GaugeSection from "../../components/dashboard/GaugeSection/GaugeSection";
import DistributionChart from "../../components/dashboard/DistributionChart/DistributionChart";
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

function processReadings(readings) {
  if (!readings || readings.length === 0) {
    return { latest: {}, timeSeries: [], dailyConsumption: [], status: "offline", lastUpdate: "—" };
  }

  const sorted = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const latest = readings[0];

  const timeSeries = sorted.map((r) => ({
    time: formatHour(r.timestamp),
    power: r.potenciaAtiva ?? 0,
  }));

  const dailyMap = {};
  readings.forEach((r) => {
    const d = new Date(r.timestamp);
    const day = DAY_NAMES[d.getDay()];
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(r.consumokWh ?? 0);
  });

  const dailyConsumption = DAY_NAMES.map((day) => {
    const vals = dailyMap[day] || [];
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { day, consumption: +avg.toFixed(3) };
  }).filter((d) => d.consumption > 0);

  return {
    latest,
    timeSeries,
    dailyConsumption: dailyConsumption.length > 0 ? dailyConsumption : [],
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

  if (error) {
    return (
      <motion.section
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <DashboardHeader status="offline" />
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

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardHeader
        status={processed?.status || "offline"}
        lastUpdate={processed?.lastUpdate || "—"}
      />

      <KPICards readings={latest} loading={loading} />

      <div className={styles.chartsRow}>
        <LineChart data={timeSeries} loading={loading} />
        <div className={styles.analyticsCol}>
          <CostTrend data={timeSeries} loading={loading} />
          <EnergyAnalysis readings={readings || []} loading={loading} />
        </div>
      </div>

      <GaugeSection readings={latest} loading={loading} />

      <div className={styles.chartsRow}>
        <DistributionChart readings={readings || []} loading={loading} />
        <div />
      </div>
    </motion.section>
  );
}

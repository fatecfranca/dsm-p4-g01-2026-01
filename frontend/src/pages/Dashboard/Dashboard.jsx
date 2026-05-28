import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import MetricChart from "../../components/dashboard/MetricChart/MetricChart";
import { fetchTelemetria } from "../../services/telemetriaService";
import { colors } from "../../theme/colors";
import styles from "./Dashboard.module.css";

function formatTimeBR(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function processReadings(readings) {
  if (!readings || readings.length === 0) {
    return { latest: {}, status: "offline", lastUpdate: "—" };
  }
  const sorted = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const latest = sorted[sorted.length - 1];
  return {
    latest,
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

  const latest = processed?.latest || {};

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.header}>
        <DashboardHeader status={processed?.status || "offline"} lastUpdate={processed?.lastUpdate || "—"} />
      </div>

      <KPICards readings={latest} loading={loading} />

      <div className={styles.chartsRow}>
        <MetricChart
          readings={readings || []}
          field="voltagem"
          label="Tensão"
          unit="V"
          color={colors.primary}
          thresholds={{ min: 0, max: 300 }}
          loading={loading}
          delay={0}
        />
        <MetricChart
          readings={readings || []}
          field="corrente"
          label="Corrente"
          unit="A"
          color={colors.info}
          thresholds={{ min: 0, max: 10 }}
          loading={loading}
          delay={0.08}
        />
        <MetricChart
          readings={readings || []}
          field="potenciaAtiva"
          label="Potência Ativa"
          unit="W"
          color={colors.warning}
          thresholds={{ min: -100, max: 500 }}
          loading={loading}
          delay={0.16}
        />
      </div>
    </motion.section>
  );
}

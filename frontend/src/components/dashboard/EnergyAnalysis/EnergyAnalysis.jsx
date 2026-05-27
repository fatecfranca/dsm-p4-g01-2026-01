import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./EnergyAnalysis.module.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: "#162032",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 6,
          padding: "6px 10px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        <p style={{ color: colors.textPrimary, fontSize: 11, fontWeight: 600, margin: 0 }}>
          {d.voltagem.toFixed(2)}V × {d.corrente.toFixed(3)}A
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 10, margin: "2px 0 0" }}>
          Potência: {d.potenciaAtiva.toFixed(2)}W
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 10, margin: 0 }}>
          {d.hora}
        </p>
      </div>
    );
  }
  return null;
};

function Skeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.skeletonTitle} />
      </div>
      <div className={styles.skeletonChart}>
        <div className={styles.skeletonLine} />
      </div>
    </div>
  );
}

export default function EnergyAnalysis({ readings, loading }) {
  const { scatterData, stats } = useMemo(() => {
    if (!readings || readings.length === 0) {
      return { scatterData: [], stats: null };
    }

    const data = readings
      .filter(r => r.voltagem != null && r.corrente != null)
      .map((r) => {
        const d = new Date(r.timestamp);
        return {
          voltagem: r.voltagem,
          corrente: r.corrente,
          potenciaAtiva: r.potenciaAtiva ?? 0,
          hora: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
        };
      });

    const voltagens = data.map(d => d.voltagem);
    const correntes = data.map(d => d.corrente);

    const stats = {
      vMin: Math.min(...voltagens),
      vMax: Math.max(...voltagens),
      vAvg: voltagens.reduce((a, b) => a + b, 0) / voltagens.length,
      cMin: Math.min(...correntes),
      cMax: Math.max(...correntes),
      cAvg: correntes.reduce((a, b) => a + b, 0) / correntes.length,
    };

    return { scatterData: data, stats };
  }, [readings]);

  if (loading) return <Skeleton />;
  if (!scatterData || scatterData.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span>Nenhum dado disponível</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Relação V × A</h3>
          <span className={styles.subtitle}>Anomalias de Leitura</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>V min</span>
          <span className={styles.statValue}>{stats.vMin.toFixed(1)}V</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>V máx</span>
          <span className={styles.statValue}>{stats.vMax.toFixed(1)}V</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>V μ</span>
          <span className={styles.statValue}>{stats.vAvg.toFixed(1)}V</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>A μ</span>
          <span className={styles.statValue}>{stats.cAvg.toFixed(3)}A</span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={140}>
          <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />

            <XAxis
              dataKey="voltagem"
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={3}
              domain={["auto", "auto"]}
            />

            <YAxis
              dataKey="corrente"
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              domain={["auto", "auto"]}
            />

            <ZAxis range={[20, 40]} />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

            <Scatter
              data={scatterData}
              fill={colors.info}
              stroke="none"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

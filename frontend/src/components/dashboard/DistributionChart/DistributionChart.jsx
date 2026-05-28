import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./DistributionChart.module.css";

function buildBins(readings, field, binCount = 8) {
  const values = readings
    .map(r => r[field])
    .filter(v => v != null && isFinite(v));

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return [{ name: `${min.toFixed(1)}`, count: values.length }];

  const binSize = range / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    name: `${(min + i * binSize).toFixed(0)}–${(min + (i + 1) * binSize).toFixed(0)}`,
    min: min + i * binSize,
    max: min + (i + 1) * binSize,
    count: 0,
  }));

  values.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binSize), binCount - 1);
    bins[idx].count++;
  });

  return bins.filter(b => b.count > 0);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
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
        <p style={{ color: colors.textSecondary, fontSize: 10, margin: 0 }}>{label} W</p>
        <p style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600, margin: "2px 0 0" }}>
          {payload[0].value} amostra{payload[0].value !== 1 ? "s" : ""}
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

export default function DistributionChart({ readings, loading }) {
  const bins = useMemo(() => {
    if (!readings || readings.length === 0) return [];
    // Filter only positive potenciaAtiva — negative values are inverted sensor readings
    const positiveReadings = readings.filter(r => (r.potenciaAtiva ?? 0) > 0);
    return buildBins(positiveReadings, "potenciaAtiva", 8);
  }, [readings]);

  const maxCount = Math.max(...bins.map(b => b.count), 1);

  if (loading) return <Skeleton />;
  if (bins.length === 0) {
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
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Distribuição de Potência</h3>
          <span className={styles.subtitle}>Onde o equipamento mais opera</span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={bins} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="distGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.info} stopOpacity={0.85} />
                <stop offset="100%" stopColor={colors.info} stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fill: colors.textSecondary, fontSize: 8, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={3}
              interval={0}
            />

            <YAxis
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              allowDecimals={false}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

            <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={40}>
              {bins.map((entry, index) => {
                const ratio = entry.count / maxCount;
                return (
                  <Cell
                    key={index}
                    fill={ratio >= 0.8 ? colors.primary : ratio >= 0.5 ? colors.info : colors.border}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.insight}>
        {bins.length > 0 && (
          <>
            O equipamento passa a maior parte do tempo na faixa de{" "}
            <strong>{bins[0].name} W</strong>
            {bins.length > 1 && bins[0].count > bins[1].count * 2
              ? ", indicando operação estável"
              : ", com variações esperadas"}
            .
          </>
        )}
      </p>
    </motion.div>
  );
}

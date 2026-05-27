import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./LineChart.module.css";

function computeDomain(values) {
  if (values.length === 0) return [0, 100];
  const sorted = [...values].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const median = sorted[Math.floor(sorted.length / 2)];
  return [0, Math.max(p95 * 1.3, median * 2)];
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
        <p style={{ color: colors.textSecondary, fontSize: 10, margin: 0 }}>{label}</p>
        <p style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600, margin: "2px 0 0" }}>
          {payload[0].value.toFixed(2)} W
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
        <div className={styles.skeletonBadge} />
      </div>
      <div className={styles.skeletonChart}>
        <div className={styles.skeletonLine} />
      </div>
    </div>
  );
}

export default function LineChart({ data, loading }) {
  if (loading) return <Skeleton />;
  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span>Nenhum dado disponível</span>
        </div>
      </div>
    );
  }

  const domain = computeDomain(data.map(d => d.power));

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Potência Ativa</h3>
          <span className={styles.subtitle}>vs Tempo</span>
        </div>
        <span className={styles.badge}>{data.length}h</span>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="powerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={4}
              interval="preserveStartEnd"
              minTickGap={40}
            />

            <YAxis
              domain={domain}
              tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

            <Area
              type="monotone"
              dataKey="power"
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="url(#powerGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: colors.primary,
                stroke: colors.surface,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

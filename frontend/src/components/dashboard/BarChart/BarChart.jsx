import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./BarChart.module.css";

function Skeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.skeletonTitle} />
      </div>
      <div className={styles.skeletonChart}>
        <div className={styles.skeletonBars} />
      </div>
    </div>
  );
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
          {Number(payload[0].value).toFixed(2)} kWh
        </p>
      </div>
    );
  }
  return null;
};

export default function BarChart({ data, loading }) {
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

  const maxVal = Math.max(...data.map(d => d.consumption));

  const barColor = (val) => {
    const ratio = val / maxVal;
    if (ratio >= 0.9) return "url(#dangerGrad)";
    if (ratio >= 0.7) return "url(#warningGrad)";
    return "url(#primaryGrad)";
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Consumo Diário</h3>
          <span className={styles.subtitle}>kWh</span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={210}>
          <RechartsBarChart data={data} margin={{ top: 20, right: 8, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="warningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.warning} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.warning} stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.danger} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.danger} stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

            <XAxis
              dataKey="day"
              tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={4}
            />

            <YAxis
              tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

            <Bar dataKey="consumption" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell key={index} fill={barColor(entry.consumption)} />
              ))}
              <LabelList
                dataKey="consumption"
                position="top"
                formatter={(val) => Number(val).toFixed(1)}
                style={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

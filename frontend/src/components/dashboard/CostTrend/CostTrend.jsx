import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./CostTrend.module.css";

function linearRegression(values) {
  const n = values.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  values.forEach((y, i) => {
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumX2 += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
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
        {payload.map((entry, i) => (
          <p
            key={i}
            style={{
              color: entry.color,
              fontSize: 12,
              fontWeight: 600,
              margin: "2px 0 0",
            }}
          >
            {Number(entry.value).toFixed(2)} {entry.name === "Tendência" ? "W" : "W"}
          </p>
        ))}
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

export default function CostTrend({ data, loading }) {
  const { chartData, trendLineData, regression } = useMemo(() => {
    if (!data || data.length < 2) {
      return { chartData: data || [], trendLineData: [], regression: null };
    }

    const values = data.map(d => d.power);
    const reg = linearRegression(values);

    let trend = [];
    if (reg) {
      trend = [
        { x: 0, y: reg.intercept, time: data[0].time },
        { x: data.length - 1, y: reg.slope * (data.length - 1) + reg.intercept, time: data[data.length - 1].time },
      ];
    }

    return { chartData: data, trendLineData: trend, regression: reg };
  }, [data]);

  if (loading) return <Skeleton />;
  if (!chartData || chartData.length === 0) {
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
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>Tendência de Potência</h3>
          <span className={styles.subtitle}>Regressão Linear</span>
        </div>
        {regression && (
          <span className={styles.badge}>
            y = {regression.slope.toFixed(2)}x {regression.intercept >= 0 ? "+" : ""} {regression.intercept.toFixed(2)}
          </span>
        )}
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
            <defs>
              <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.warning} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colors.warning} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={4}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              domain={["auto", "auto"]}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

            <Area
              type="monotone"
              dataKey="power"
              stroke={colors.warning}
              strokeWidth={2}
              fill="url(#costGradient)"
              dot={false}
              activeDot={{ r: 3, fill: colors.warning, stroke: colors.surface, strokeWidth: 2 }}
            />

            {trendLineData.length === 2 && (
              <Line
                data={trendLineData}
                dataKey="y"
                stroke={colors.danger}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                connectNulls
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

import { useMemo } from "react";
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

function formatTick(value) {
  if (value >= 100) return value.toFixed(0);
  if (value >= 1) return value.toFixed(1);
  if (value >= 0.1) return value.toFixed(2);
  return value.toFixed(3);
}

function computeDomain(values) {
  if (values.length < 2) return [0, 100];
  const sorted = [...values].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const min = Math.max(0, p5 * 0.8);
  const max = p95 * 1.3;
  return max > min ? [min, max] : [0, max || 100];
}

const CustomTooltip = ({ active, payload, label, unit }) => {
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
          {Number(payload[0].value).toFixed(2)} {unit}
        </p>
      </div>
    );
  }
  return null;
};

function Skeleton() {
  return (
    <div style={{ background: colors.surface, borderRadius: 12, padding: "1rem 0.75rem" }}>
      <div style={{ height: 14, width: "60%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ height: 36, width: "40%", background: "rgba(255,255,255,0.04)", borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 140, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)", borderRadius: 8, animation: "shimmer 2s ease-in-out infinite" }} />
    </div>
  );
}

const styles = {
  container: {
    background: colors.surface,
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "1rem 0.75rem",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  title: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: colors.textSecondary,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  currentRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 2,
  },
  currentValue: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.1,
    color: colors.textPrimary,
  },
  currentUnit: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.textSecondary,
  },
  statsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: "0.6875rem",
    color: colors.textSecondary,
  },
  statValue: {
    fontWeight: 600,
    color: colors.textPrimary,
  },
  insight: {
    fontSize: "0.6875rem",
    color: colors.textSecondary,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid rgba(255,255,255,0.04)",
    lineHeight: 1.4,
  },
  error: {
    padding: "0.5rem",
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: "0.8125rem",
  },
};

export default function MetricChart({ readings, field, label, unit, color, thresholds, loading, delay = 0 }) {
  const { chartData, stats, domain } = useMemo(() => {
    if (!readings || readings.length === 0) {
      return { chartData: [], stats: null, domain: [0, 100] };
    }

    const sorted = [...readings]
      .filter(r => r[field] != null && isFinite(r[field]))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let filtered = sorted;
    if (thresholds) {
      filtered = sorted.filter(r => {
        const v = r[field];
        if (thresholds.min !== undefined && v < thresholds.min) return false;
        if (thresholds.max !== undefined && v > thresholds.max) return false;
        return true;
      });
    }

    if (filtered.length === 0) {
      return { chartData: [], stats: null, domain: [0, 100] };
    }

    const values = filtered.map(r => r[field]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const first = filtered[0].timestamp;
    const last = filtered[filtered.length - 1].timestamp;
    const multiDay = first?.slice(0, 10) !== last?.slice(0, 10);

    const formatTime = (ts) => {
      const d = new Date(ts);
      const hhmm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      if (multiDay) {
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${hhmm}`;
      }
      return hhmm;
    };

    const chartData = filtered.map(r => ({
      time: formatTime(r.timestamp),
      value: r[field],
    }));

    const domain = computeDomain(values);

    return { chartData, stats: { avg, min, max }, domain };
  }, [readings, field, thresholds]);

  if (loading) return <Skeleton />;

  const latest = chartData.length > 0 ? chartData[chartData.length - 1].value : null;

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div style={styles.header}>
        <span style={styles.title}>{label}</span>
      </div>

      <div style={styles.currentRow}>
        <span style={{ ...styles.currentValue, color }}>
          {latest !== null ? Number(latest).toFixed(2) : "—"}
        </span>
        <span style={styles.currentUnit}>{unit}</span>
      </div>

      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            Min <span style={styles.statValue}>{stats.min.toFixed(1)}</span>
          </div>
          <div style={styles.stat}>
            Méd <span style={styles.statValue}>{stats.avg.toFixed(1)}</span>
          </div>
          <div style={styles.stat}>
            Máx <span style={styles.statValue}>{stats.max.toFixed(1)}</span>
          </div>
        </div>
      )}

      {chartData.length > 0 ? (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
              <defs>
                <linearGradient id={`grad-${field}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
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
                minTickGap={60}
              />

              <YAxis
                domain={domain}
                tickFormatter={formatTick}
                tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
                tickLine={false}
                axisLine={false}
                tickMargin={2}
              />

              <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#grad-${field})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: color,
                  stroke: colors.surface,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={styles.error}>Nenhum dado disponível</div>
      )}

      {stats && chartData.length > 0 && (
        <p style={styles.insight}>
          {latest > stats.avg * 1.1
            ? `Valor atual ${(latest / stats.avg - 1) * 100 > 0 ? "acima" : "abaixo"} da média.`
            : `Operação dentro da faixa esperada (${stats.min.toFixed(0)}–${stats.max.toFixed(0)} ${unit}).`}
        </p>
      )}
    </motion.div>
  );
}

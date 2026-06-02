import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { colors } from "../../../theme/colors";

const card = {
  background: colors.surface,
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "1rem 0.75rem",
  minHeight: 220,
  display: "flex",
  flex: 1,
  flexDirection: "column",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const title = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: colors.textSecondary,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const legendWrap = { display: "flex", gap: 14 };

const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  fontSize: "0.6875rem",
  color: colors.textSecondary,
};

function legendDot(c) {
  return { width: 8, height: 8, borderRadius: "50%", background: c };
}

function formatTick(value) {
  if (value >= 100) return value.toFixed(0);
  if (value >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#162032",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6,
      padding: "6px 10px",
    }}>
      <p style={{ color: colors.textSecondary, fontSize: 10, margin: 0 }}>{payload[0]?.payload?.time}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 600, margin: "2px 0 0" }}>
          {p.name}: {Number(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export default function TimeSeriesChart({ readings, delay = 0 }) {
  const chartData = useMemo(() => {
    if (!readings?.length) return [];
    const sorted = [...readings]
      .filter(r => r.potenciaKw != null && r.voltagem != null)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const first = sorted[0]?.timestamp;
    const last = sorted[sorted.length - 1]?.timestamp;
    const multiDay = first?.slice(0, 10) !== last?.slice(0, 10);

    return sorted.map(r => {
      const d = new Date(r.timestamp);
      const hhmm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const time = multiDay
        ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${hhmm}`
        : hhmm;
      return { time, kW: r.potenciaKw, V: r.voltagem };
    });
  }, [readings]);

  return (
    <motion.div
      style={card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div style={header}>
        <span style={title}>Linha do Tempo</span>
        <div style={legendWrap}>
          <div style={legendItem}>
            <div style={legendDot(colors.primary)} />
            Potência (kW)
          </div>
          <div style={legendItem}>
            <div style={legendDot(colors.secondary)} />
            Tensão (V)
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textSecondary, fontSize: "0.8125rem" }}>
          Nenhum dado de potência ou tensão disponível
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 2, left: -4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

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
                yAxisId="kW"
                orientation="left"
                tickFormatter={formatTick}
                tick={{ fill: colors.primary, fontSize: 9, fontFamily: "Inter" }}
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                width={40}
              />

              <YAxis
                yAxisId="V"
                orientation="right"
                tickFormatter={formatTick}
                tick={{ fill: colors.secondary, fontSize: 9, fontFamily: "Inter" }}
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                width={40}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

              <Line
                yAxisId="kW"
                type="monotone"
                dataKey="kW"
                name="Potência"
                stroke={colors.primary}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 3, fill: colors.primary, stroke: colors.surface, strokeWidth: 2 }}
              />

              <Line
                yAxisId="V"
                type="monotone"
                dataKey="V"
                name="Tensão"
                stroke={colors.secondary}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 3, fill: colors.secondary, stroke: colors.surface, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

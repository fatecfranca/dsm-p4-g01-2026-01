import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { colors } from "../../../theme/colors";

const cardStyle = {
  background: colors.surface,
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "1rem 0.75rem",
  minHeight: 220,
  display: "flex",
  flex: 1,
  flexDirection: "column",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: "#162032",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6,
      padding: "6px 10px",
    }}>
      <p style={{ color: colors.textSecondary, fontSize: 9, margin: "0 0 4px" }}>Tensão (V)</p>
      {d && <>
        <p style={{ color: colors.textPrimary, fontSize: 11, margin: 0 }}>Mín: {d.minV?.toFixed(1)}</p>
        <p style={{ color: colors.textPrimary, fontSize: 11, margin: 0 }}>Q1: {d.q1?.toFixed(1)}</p>
        <p style={{ color: colors.warning, fontSize: 11, fontWeight: 600, margin: 0 }}>Mediana: {d.mediana?.toFixed(1)}</p>
        <p style={{ color: colors.textPrimary, fontSize: 11, margin: 0 }}>Q3: {d.q3?.toFixed(1)}</p>
        <p style={{ color: colors.textPrimary, fontSize: 11, margin: 0 }}>Máx: {d.maxV?.toFixed(1)}</p>
      </>}
    </div>
  );
};

function BoxShape(props) {
  const { x, width, height, payload } = props;
  if (!payload || height <= 0) return null;
  const d = payload;
  const dMin = d.domainLow;
  const dMax = d.domainHigh;
  const range = dMax - dMin || 1;
  const scale = v => props.y + height * (1 - (v - dMin) / range);
  const cx = x + width / 2;
  const bw = Math.min(width * 0.55, 60);

  const pMin = scale(Math.max(d.minV, dMin));
  const pMax = scale(Math.min(d.maxV, dMax));
  const pQ1 = scale(d.q1);
  const pQ3 = scale(d.q3);
  const pMed = scale(d.mediana);

  return (
    <g>
      <line x1={cx} y1={pMin} x2={cx} y2={pMax} stroke={colors.secondary} strokeWidth={1.5} />
      <line x1={cx - bw * 0.35} y1={pMin} x2={cx + bw * 0.35} y2={pMin} stroke={colors.secondary} strokeWidth={2} strokeLinecap="round" />
      <line x1={cx - bw * 0.35} y1={pMax} x2={cx + bw * 0.35} y2={pMax} stroke={colors.secondary} strokeWidth={2} strokeLinecap="round" />
      <rect x={cx - bw / 2} y={pQ3} width={bw} height={Math.max(pQ1 - pQ3, 1)} fill={colors.secondary} fillOpacity={0.15} stroke={colors.secondary} strokeWidth={1} rx={1} />
      <line x1={cx - bw / 2} y1={pMed} x2={cx + bw / 2} y2={pMed} stroke={colors.warning} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

export default function BoxPlotChart({ descritiva, descritivaBase, field = "voltagem", label = "Tensão", delay = 0 }) {
  const stats = descritiva?.[field];
  const statsBase = descritivaBase?.[field];
  const box = stats?.boxPlot;

  const min = stats?.min ?? statsBase?.min;
  const max = stats?.max ?? statsBase?.max;
  const domain = stats?.domain ?? statsBase?.domain;

  if (!stats || !box || min == null || max == null) {
    return (
      <div style={{ ...cardStyle, alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: colors.textSecondary, fontSize: "0.8125rem" }}>Sem dados de {label.toLowerCase()}</span>
      </div>
    );
  }

  const domainLow = domain?.[0] ?? min;
  const domainHigh = domain?.[1] ?? max;

  const chartData = [{
    name: label,
    minV: min,
    q1: box.q1,
    mediana: box.mediana,
    q3: box.q3,
    maxV: max,
    domainLow,
    domainHigh,
  }];

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: colors.textSecondary, letterSpacing: "0.02em", textTransform: "uppercase" }}>
          BoxPlot — {label}
        </span>
        <span style={{ display: "flex", gap: 12, fontSize: "0.6875rem", color: colors.textSecondary }}>
          <span>Média: <strong style={{ color: colors.textPrimary }}>{parseFloat(stats.media).toFixed(1)} V</strong></span>
          <span>Desvio: <strong style={{ color: colors.textPrimary }}>±{parseFloat(stats.desvioPadrao).toFixed(2)} V</strong></span>
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: colors.border, strokeWidth: 1 }}
              tickMargin={4}
            />

            <YAxis
              domain={[domainLow, domainHigh]}
              tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              width={48}
              tickFormatter={v => v.toFixed(1)}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Bar dataKey="domainHigh" shape={<BoxShape />} fill="transparent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

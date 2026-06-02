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

const cardStyle = {
  background: colors.surface,
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "1rem 0.75rem",
  height: "100%",
  minHeight: 220,
  display: "flex",
  flex: 1,
  flexDirection: "column",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const central = payload.find(p => p.dataKey === "central");
  const upper = payload.find(p => p.dataKey === "upper");
  const lower = payload.find(p => p.dataKey === "lower");
  return (
    <div style={{
      background: "#162032",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6,
      padding: "6px 10px",
    }}>
      <p style={{ color: colors.textSecondary, fontSize: 10, margin: "0 0 4px" }}>{label}</p>
      {central && (
        <p style={{ color: colors.primary, fontSize: 12, fontWeight: 600, margin: 0 }}>
          Previsto: R$ {Number(central.value).toFixed(2)}
        </p>
      )}
      {upper && lower && (
        <p style={{ color: colors.textSecondary, fontSize: 11, margin: "2px 0 0" }}>
          IC 95%: R$ {Number(lower.value).toFixed(2)} – R$ {Number(upper.value).toFixed(2)}
        </p>
      )}
    </div>
  );
};

function ArrowUpIcon({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function MinusIcon({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function ForecastChart({ preditiva, delay = 0 }) {
  const ic = preditiva?.intervaloConfianca95;
  const previsaoRaw = preditiva?.previsaoFaturaMensal ?? preditiva?.custoAtual;
  const previsao = previsaoRaw ? parseFloat(previsaoRaw) : 0;
  const valMin = ic?.minimoEsperado ? parseFloat(ic.minimoEsperado) : previsao * 0.9;
  const valMax = ic?.maximoEsperado ? parseFloat(ic.maximoEsperado) : previsao * 1.1;

  const isIncreasing = preditiva?.tendenciaDeCusto === "Aumentando";
  const trendColor = isIncreasing ? colors.danger : colors.textSecondary;
  const lineColor = isIncreasing ? colors.danger : colors.primary;

  const chartData = previsao > 0
    ? [
        { name: "Mín",     upper: valMin,    lower: valMin,    central: valMin },
        { name: "Previsto", upper: valMax,   lower: valMin,    central: previsao },
        { name: "Máx",     upper: valMax,    lower: valMax,    central: valMax },
      ]
    : [];

  const yPad = (valMax - valMin) * 0.2 || 1;
  const yMin = Math.max(0, valMin - yPad);
  const yMax = valMax + yPad;

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: colors.textSecondary, letterSpacing: "0.02em", textTransform: "uppercase" }}>
          Previsão Mensal IC 95%
        </span>
        {preditiva?.tendenciaDeCusto && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: trendColor,
            border: `1px solid ${trendColor}30`,
            background: `${trendColor}0d`,
            borderRadius: 4,
            padding: "2px 6px",
          }}>
            {isIncreasing ? <ArrowUpIcon color={trendColor} /> : <MinusIcon color={trendColor} />}
            {preditiva.tendenciaDeCusto}
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div style={{ flex: 1, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textSecondary, fontSize: "0.8125rem" }}>
          Sem dados preditivos
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="icGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fill: colors.textSecondary, fontSize: 10, fontFamily: "Inter" }}
                tickLine={false}
                axisLine={{ stroke: colors.border, strokeWidth: 1 }}
                tickMargin={4}
              />

              <YAxis
                domain={[yMin, yMax]}
                tick={{ fill: colors.textSecondary, fontSize: 9, fontFamily: "Inter" }}
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                width={52}
                tickFormatter={v => `${v.toFixed(0)}`}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />

              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#icGrad)"
                fillOpacity={1}
              />

              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill={colors.surface}
                fillOpacity={1}
              />

              <Line
                type="monotone"
                dataKey="central"
                name="Previsto"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ fill: lineColor, r: 4, stroke: colors.surface, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: lineColor }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

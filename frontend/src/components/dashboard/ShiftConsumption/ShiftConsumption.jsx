import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { colors } from "../../../theme/colors";

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function SunsetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 00-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="16 5 12 9 8 5" />
    </svg>
  );
}

const SHIFT_META = [
  { key: "madrugada", label: "Madrugada", color: "#4F46E5", icon: <MoonIcon />, hours: "00h–06h" },
  { key: "manha",     label: "Manhã",     color: "#F59E0B", icon: <SunIcon />,    hours: "06h–12h" },
  { key: "tarde",     label: "Tarde",     color: "#F97316", icon: <SunsetIcon />, hours: "12h–18h" },
  { key: "noite",     label: "Noite",     color: "#3B82F6", icon: <MoonIcon />,   hours: "18h–00h" },
];

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

function formatKWh(value) {
  if (value == null) return "—";
  if (value >= 100) return value.toFixed(0);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}

export default function ShiftConsumption({ consumoPorTurno, delay = 0 }) {
  const data = useMemo(() => {
    if (!consumoPorTurno) return [];
    return SHIFT_META.map(s => ({
      name: s.label,
      hours: s.hours,
      value: consumoPorTurno[s.key] || 0,
      color: s.color,
      icon: s.icon,
    })).filter(d => d.value > 0);
  }, [consumoPorTurno]);

  const total = useMemo(() => data.reduce((a, d) => a + d.value, 0), [data]);
  const dominant = useMemo(() => data.length > 0 ? data.reduce((a, d) => d.value > a.value ? d : a, data[0]) : null, [data]);

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: colors.textSecondary, letterSpacing: "0.02em", textTransform: "uppercase" }}>
          Consumo por Turno
        </span>
        {dominant && (
          <span style={{
            fontSize: "0.625rem",
            fontWeight: 600,
            color: dominant.color,
            background: `${dominant.color}15`,
            border: `1px solid ${dominant.color}30`,
            borderRadius: 4,
            padding: "2px 6px",
          }}>
            Pico: {dominant.name}
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div style={{ flex: 1, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textSecondary, fontSize: "0.8125rem" }}>
          Sem dados de estratificação
        </div>
      ) : (
        <>
          <div style={{ height: 150, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="48%"
                  outerRadius="72%"
                  dataKey="value"
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1 }}>
                {formatKWh(total)}
              </div>
              <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2 }}>kWh total</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
            {data.map(d => {
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: d.color, display: "flex", alignItems: "center", flexShrink: 0 }}>{d.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: colors.textPrimary }}>{d.name}</span>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: d.color, whiteSpace: "nowrap", marginLeft: 6 }}>
                        {formatKWh(d.value)} kWh
                      </span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                    </div>
                    <span style={{ fontSize: "0.5625rem", color: colors.textSecondary }}>{d.hours} · {pct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}

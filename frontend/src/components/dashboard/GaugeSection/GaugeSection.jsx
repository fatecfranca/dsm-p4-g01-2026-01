import { motion } from "framer-motion";
import { currentReadings } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./GaugeSection.module.css";

function Gauge({ label, value, unit, min, max, color }) {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const cx = 100;
  const cy = 100;
  const r = 72;
  const trackArc = describeArc(cx, cy, r, -180, 0);
  const fullArc = describeArc(cx, cy, r, -180, 0);

  const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

  return (
    <motion.div
      className={styles.gauge}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <svg viewBox="0 0 200 135" className={styles.svg}>
        <path
          d={trackArc}
          fill="none"
          stroke="#2a3a4f"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <motion.path
          d={fullArc}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="300"
          initial={{ strokeDashoffset: 300 }}
          animate={{ strokeDashoffset: 300 - normalized * 300 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />

        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={colors.textPrimary}
          fontSize="24"
          fontWeight="700"
          fontFamily="Inter"
        >
          {displayValue}
        </text>

        {unit && (
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill={colors.textSecondary}
            fontSize="11"
            fontWeight="500"
            fontFamily="Inter"
          >
            {unit}
          </text>
        )}
      </svg>

      <span className={styles.label}>{label}</span>
    </motion.div>
  );
}

export default function GaugeSection() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className={styles.title}>Status da Rede</h3>

      <div className={styles.gauges}>
        <Gauge
          label="Frequência da Rede"
          value={currentReadings.frequency}
          unit="Hz"
          min={57}
          max={63}
          color={colors.primary}
        />
        <Gauge
          label="Fator de Potência"
          value={currentReadings.powerFactor}
          unit=""
          min={0.7}
          max={1.0}
          color={colors.info}
        />
      </div>
    </motion.div>
  );
}

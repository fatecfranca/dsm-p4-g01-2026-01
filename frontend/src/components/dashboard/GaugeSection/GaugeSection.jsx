import { motion } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import { colors } from "../../../theme/colors";
import styles from "./GaugeSection.module.css";

function Gauge({ label, value, min, max, unit, color }) {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const displayValue = typeof value === "number" ? value.toFixed(2) : value;

  const data = [
    { name: "Valor", value: normalized },
    { name: "Restante", value: 1 - normalized },
  ];

  return (
    <motion.div
      className={styles.gauge}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
    >
      <div className={styles.gaugeChartWrap}>
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            cx="50%"
            cy="55%"
            startAngle={180}
            endAngle={0}
            innerRadius={62}
            outerRadius={80}
            dataKey="value"
            cornerRadius={6}
            paddingAngle={1}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.name === "Valor" ? color : colors.border}
              />
            ))}
          </Pie>
        </PieChart>
        <div className={styles.gaugeOverlay}>
          <span className={styles.gaugeNumber}>{displayValue}</span>
          {unit && <span className={styles.gaugeUnit}>{unit}</span>}
        </div>
      </div>

      <span className={styles.gaugeLabel}>{label}</span>
    </motion.div>
  );
}

function SkeletonGauge() {
  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeChartWrap}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <path
            d="M 20 99 A 70 70 0 0 0 160 99"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.skeletonLabel} />
    </div>
  );
}

export default function GaugeSection({ readings, loading }) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonTitle} />
        <div className={styles.grid}>
          <SkeletonGauge />
          <SkeletonGauge />
        </div>
      </div>
    );
  }

  const r = readings || {};

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
    >
      <h3 className={styles.title}>Status da Rede</h3>

      <div className={styles.grid}>
        {/* frequencia is 100% null in DB — show potenciaAparente instead */}
        <Gauge
          label="Potência Aparente"
          value={r.potenciaAparente ?? 0}
          min={0}
          max={200}
          unit="VA"
          color={colors.primary}
        />
        {/* fatorPotencia can be negative (sensor polarity) — use abs value */}
        <Gauge
          label="Fator de Potência"
          value={Math.abs(r.fatorPotencia ?? 0)}
          min={0}
          max={1.0}
          unit=""
          color={colors.info}
        />
      </div>
    </motion.div>
  );
}

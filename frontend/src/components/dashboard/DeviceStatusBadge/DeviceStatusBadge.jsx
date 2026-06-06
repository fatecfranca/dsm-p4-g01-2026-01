import { motion } from "framer-motion";
import styles from "./DeviceStatusBadge.module.css";

function PowerIcon({ state }) {
  const color = state === "on" ? "var(--color-success)" : state === "invalid" ? "var(--color-danger)" : "var(--color-text-secondary)";
  if (state === "on") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
    );
  }
  if (state === "invalid") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    </svg>
  );
}

function fmtKw(value) {
  if (value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}

export default function DeviceStatusBadge({ lastReading }) {
  if (!lastReading) {
    return (
      <motion.div
        className={styles.badge}
        style={{
          background: "rgba(148, 163, 184, 0.08)",
          borderColor: "rgba(148, 163, 184, 0.2)",
        }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <span className={styles.dot} style={{ background: "var(--color-text-secondary)" }} />
        <span className={styles.label} style={{ color: "var(--color-text-secondary)" }}>
          Aparelho: sem leitura
        </span>
      </motion.div>
    );
  }

  const powerNum = Number(lastReading.potenciaKw);
  const state = !Number.isFinite(powerNum) || powerNum < 0
    ? "invalid"
    : powerNum > 0 ? "on" : "off";

  const config = {
    on: {
      bg: "rgba(34, 197, 94, 0.08)",
      border: "rgba(34, 197, 94, 0.2)",
      dot: "var(--color-success)",
      text: "Aparelho Ligado",
      color: "var(--color-success)",
    },
    off: {
      bg: "rgba(148, 163, 184, 0.08)",
      border: "rgba(148, 163, 184, 0.2)",
      dot: "var(--color-text-secondary)",
      text: "Aparelho Desligado",
      color: "var(--color-text-secondary)",
    },
    invalid: {
      bg: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.2)",
      dot: "var(--color-danger)",
      text: "Leitura Inválida",
      color: "var(--color-danger)",
    },
  }[state];

  return (
    <motion.div
      className={styles.badge}
      style={{ background: config.bg, borderColor: config.border }}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      title={state === "on" ? `Consumo atual: ${fmtKw(powerNum)} kW` : state === "invalid" ? "Sensor enviou valor negativo" : "Aparelho em standby"}
    >
      <PowerIcon state={state} />
      <span className={styles.label} style={{ color: config.color }}>
        {config.text}
      </span>
      {state === "on" && (
        <span className={styles.value} style={{ color: config.color }}>
          {fmtKw(powerNum)} kW
        </span>
      )}
      {state === "invalid" && (
        <span className={styles.value} style={{ color: config.color }}>
          {fmtKw(powerNum)} kW
        </span>
      )}
      <motion.span
        className={styles.dot}
        style={{ background: config.dot }}
        animate={state === "on" ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

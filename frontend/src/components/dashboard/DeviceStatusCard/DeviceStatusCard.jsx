import { motion } from "framer-motion";
import { colors } from "../../../theme/colors";
import styles from "./DeviceStatusCard.module.css";

function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

function OffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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

export default function DeviceStatusCard({ lastReading }) {
  if (!lastReading) {
    return (
      <motion.div
        className={styles.card}
        style={{ borderLeftColor: "var(--color-text-secondary)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
      >
        <div className={styles.iconBox} style={{ color: "var(--color-text-secondary)", background: "rgba(148, 163, 184, 0.1)" }}>
          <OffIcon />
        </div>
        <div className={styles.content}>
          <span className={styles.label}>Aparelho</span>
          <span className={styles.value} style={{ color: "var(--color-text-secondary)" }}>
            Sem leitura
          </span>
          <span className={styles.subValue}>Aguardando dados do sensor</span>
        </div>
      </motion.div>
    );
  }

  const powerNum = Number(lastReading.potenciaKw);
  const isInvalid = !Number.isFinite(powerNum) || powerNum < 0;
  const isOn = !isInvalid && powerNum > 0;

  let accent, iconColor, iconBg, stateText, subText;
  if (isInvalid) {
    accent = colors.danger;
    iconColor = colors.danger;
    iconBg = "rgba(239, 68, 68, 0.12)";
    stateText = "Leitura Inválida";
    subText = "Sensor reportou valor negativo";
  } else if (isOn) {
    accent = colors.success;
    iconColor = colors.success;
    iconBg = "rgba(34, 197, 94, 0.12)";
    stateText = "Ligado";
    subText = "Consumindo energia agora";
  } else {
    accent = "var(--color-text-secondary)";
    iconColor = "var(--color-text-secondary)";
    iconBg = "rgba(148, 163, 184, 0.1)";
    stateText = "Desligado";
    subText = "Aparelho em standby";
  }

  return (
    <motion.div
      className={styles.card}
      style={{
        borderLeftColor: accent,
        background: `linear-gradient(135deg, ${accent}08 0%, transparent 60%), var(--color-surface)`,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
    >
      <div className={styles.iconBox} style={{ color: iconColor, background: iconBg, position: "relative" }}>
        {isInvalid ? <AlertIcon /> : isOn ? <PowerIcon /> : <OffIcon />}
        {isOn && (
          <motion.span
            className={styles.pulse}
            style={{ borderColor: accent }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.label}>Aparelho</span>
        <span className={styles.value} style={{ color: accent }}>
          {stateText}
        </span>
        <span className={styles.subValue}>
          {isOn ? (
            <>
              <motion.span
                className={styles.liveDot}
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span className={styles.kwValue} style={{ color: accent }}>
                {fmtKw(powerNum)} kW
              </span>
              <span className={styles.kwUnit}>agora</span>
            </>
          ) : (
            subText
          )}
        </span>
      </div>
    </motion.div>
  );
}

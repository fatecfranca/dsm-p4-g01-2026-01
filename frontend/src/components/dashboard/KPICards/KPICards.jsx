import { motion } from "framer-motion";
import { colors } from "../../../theme/colors";
import styles from "./KPICards.module.css";

const cardConfig = [
  {
    key: "voltage",
    label: "Voltagem",
    suffix: "V",
    color: colors.primary,
    valueKey: "voltagem",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    key: "current",
    label: "Corrente",
    suffix: "A",
    color: colors.info,
    valueKey: "corrente",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12H4" />
        <path d="M16 8l4 4-4 4" />
        <path d="M8 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    key: "power",
    label: "Potência Ativa",
    suffix: "W",
    color: colors.warning,
    valueKey: "potenciaAtiva",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8l4-4M12 10l-4-4" />
        <path d="M12 14v8" />
        <path d="M8 18h8" />
      </svg>
    ),
  },
  {
    key: "cost",
    label: "Custo (R$/h)",
    color: colors.danger,
    valueKey: "custoHora",
    fallbackKey: "custoReais",
    prefix: "R$ ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
      </svg>
    ),
  },
];

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.skeletonAccent} />
      <div className={styles.cardBody}>
        <div className={styles.skeletonIcon} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonValue} />
        </div>
      </div>
    </div>
  );
}

export default function KPICards({ readings, loading }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const r = readings || {};

  return (
    <div className={styles.grid}>
      {cardConfig.map((card, index) => {
        const raw = r[card.valueKey] ?? r[card.fallbackKey];
        const displayValue = raw !== undefined && raw !== null
          ? (typeof raw === "number" ? (Math.abs(raw) < 0.005 ? "0.00" : raw.toFixed(2)) : raw)
          : "—";

        return (
          <motion.div
            key={card.key}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
          >
            <div className={styles.accent} style={{ background: card.color }} />

            <div className={styles.cardBody}>
              <div
                className={styles.iconBox}
                style={{ color: card.color, background: `${card.color}14` }}
              >
                {card.icon}
              </div>

              <div className={styles.content}>
                <span className={styles.label}>{card.label}</span>
                <span className={styles.valueRow}>
                  {card.prefix && <span className={styles.prefix}>{card.prefix}</span>}
                  <span className={styles.value}>{displayValue}</span>
                  {card.suffix && <span className={styles.suffix}>{card.suffix}</span>}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

import { motion } from "framer-motion";
import { currentReadings } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./KPICards.module.css";

const cards = [
  {
    key: "voltage",
    label: "Voltagem Atual",
    value: `${currentReadings.voltage}`,
    unit: "V",
    color: colors.primary,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    key: "current",
    label: "Corrente Atual",
    value: `${currentReadings.current}`,
    unit: "A",
    color: colors.info,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12H4" />
        <path d="M16 8l4 4-4 4" />
        <path d="M8 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    key: "power",
    label: "Potência Ativa",
    value: `${currentReadings.power}`,
    unit: "W",
    color: colors.warning,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8l4-4" />
        <path d="M12 10l-4-4" />
        <path d="M12 14v8" />
        <path d="M8 18h8" />
      </svg>
    ),
  },
  {
    key: "cost",
    label: "Custo Estimado",
    value: `R$ ${currentReadings.cost.toFixed(2)}`,
    unit: "",
    color: colors.danger,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

export default function KPICards() {
  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          className={styles.card}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          style={{
            borderColor: `rgba(255,255,255,0.05)`,
            boxShadow: `0 0 20px rgba(0,0,0,0.2)`,
          }}
        >
          <div
            className={styles.iconWrapper}
            style={{ color: card.color, background: `${card.color}15` }}
          >
            {card.icon}
          </div>
          <div className={styles.content}>
            <span className={styles.label}>{card.label}</span>
            <span className={styles.value}>
              {card.value}
              {card.unit && <span className={styles.unit}>{card.unit}</span>}
            </span>
          </div>
          <div
            className={styles.glow}
            style={{ background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

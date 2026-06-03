import { motion } from "framer-motion";
import { colors } from "../../../theme/colors";
import styles from "./KPIEnergyBar.module.css";

function fmt(value, decimals = 2) {
  if (value === null || value === undefined) return "—";
  return Number(value).toFixed(decimals).replace(".", ",");
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V4" /><path d="M12 20V10" /><path d="M6 20v-4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

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

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.skelAccent} />
      <div className={styles.cardBody}>
        <div className={styles.skelIcon} />
        <div className={styles.skelContent}>
          <div className={styles.skelLabel} />
          <div className={styles.skelValue} />
        </div>
      </div>
    </div>
  );
}

export default function KPIEnergyBar({ preditiva, voltageStats, loading }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const custoReal = preditiva?.custoAtualReal;
  const previsao = preditiva?.previsaoFaturaMensal;
  const trend = preditiva?.tendenciaDeCusto;

  const isIncreasing = trend === "Aumentando";
  const trendColor = isIncreasing ? colors.danger : colors.textSecondary;

  const media = voltageStats?.media != null ? parseFloat(voltageStats.media) : null;
  const desvio = voltageStats?.desvioPadrao != null ? parseFloat(voltageStats.desvioPadrao) : null;
  const mediana = voltageStats?.boxPlot?.mediana != null
    ? parseFloat(voltageStats.boxPlot.mediana)
    : voltageStats?.mediana != null ? parseFloat(voltageStats.mediana) : null;
  const moda = voltageStats?.moda != null ? parseFloat(voltageStats.moda) : null;
  const desvioAlert = media && desvio ? (desvio / media) > 0.05 : false;

  return (
    <div className={styles.grid}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0, ease: "easeOut" }}
      >
        <div className={styles.accent} style={{ background: colors.danger }} />
        <div className={styles.cardBody}>
          <div className={styles.iconBox} style={{ color: colors.danger, background: `${colors.danger}14` }}>
            <DollarIcon />
          </div>
          <div className={styles.content}>
            <span className={styles.label}>Custo Real Acumulado</span>
            <span className={styles.valueRow}>
              <span className={styles.prefix}>R$</span>
              <span className={styles.value}>{fmt(custoReal)}</span>
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
      >
        <div className={styles.accent} style={{ background: colors.warning }} />
        <div className={styles.cardBody}>
          <div className={styles.iconBox} style={{ color: colors.warning, background: `${colors.warning}14` }}>
            <TrendUpIcon />
          </div>
          <div className={styles.content}>
            <span className={styles.label}>Previsão Mensal</span>
            <span className={styles.valueRow}>
              <span className={styles.prefix}>R$</span>
              <span className={styles.value}>{fmt(previsao)}</span>
            </span>
            {trend && (
              <span
                className={styles.badge}
                style={{ color: trendColor, borderColor: `${trendColor}30`, background: `${trendColor}0d` }}
              >
                {isIncreasing ? <ArrowUpIcon color={trendColor} /> : <MinusIcon color={trendColor} />}
                {trend}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16, ease: "easeOut" }}
      >
        <div className={styles.accent} style={{ background: colors.primary }} />
        <div className={styles.cardBody}>
          <div className={styles.iconBox} style={{ color: colors.primary, background: `${colors.primary}14` }}>
            <ZapIcon />
          </div>
          <div className={styles.content}>
            <span className={styles.label}>Qualidade da Tensão</span>
            {voltageStats ? (
              <div className={styles.statsGrid}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Média</span>
                  <span className={styles.statValue}>{fmt(media, 1)} V</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Mediana</span>
                  <span className={styles.statValue}>{fmt(mediana, 1)} V</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Moda</span>
                  <span className={styles.statValue}>{fmt(moda, 1)} V</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Desvio</span>
                  <span className={styles.statValue} style={{ color: desvioAlert ? colors.danger : colors.textPrimary }}>
                    ±{fmt(desvio, 2)} V
                  </span>
                </div>
              </div>
            ) : (
              <span className={styles.noData}>Sem dados de tensão</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

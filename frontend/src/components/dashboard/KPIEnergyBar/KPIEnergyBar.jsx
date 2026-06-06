import { motion } from "framer-motion";
import { colors } from "../../../theme/colors";
import {
  TARIFA_KWH,
  FATOR_POTENCIA_LIMITE,
  FREQUENCIA_ESTAVEL_MIN,
  FREQUENCIA_ESTAVEL_MAX,
} from "../../../constants/config";
import DeviceStatusCard from "../DeviceStatusCard/DeviceStatusCard";
import styles from "./KPIEnergyBar.module.css";

function fmt(value, decimals = 2) {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(decimals).replace(".", ",");
}

function safeFloat(value) {
  if (value == null) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
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

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function SpeedometerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14v-4" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      <path d="M15 9.5V12" />
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

function CheckIcon({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function KPICard({ accent, icon, label, value, prefix, sub, badge, delay = 0, flex = 1 }) {
  return (
    <motion.div
      className={styles.card}
      style={{ flex }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <div className={styles.accent} style={{ background: accent }} />
      <div className={styles.cardBody}>
        <div
          className={styles.iconBox}
          style={{ color: accent, background: `${accent}1A` }}
        >
          {icon}
        </div>
        <div className={styles.content}>
          <span className={styles.label}>{label}</span>
          <span className={styles.valueRow}>
            {prefix && <span className={styles.prefix}>{prefix}</span>}
            <span className={styles.value}>{value}</span>
          </span>
          {sub}
          {badge}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.card} style={{ flex: 1 }}>
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

export default function KPIEnergyBar({ preditiva, voltageStats, fatorPotenciaStats, frequenciaStats, loading, lastReading }) {
  if (loading) {
    return (
      <div className={styles.kpiRow}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const custoReal = preditiva?.custoAtualReal;
  const previsao = preditiva?.previsaoFaturaMensal;
  const trend = preditiva?.tendenciaDeCusto;
  const isIncreasing = trend === "Aumentando";
  const trendColor = isIncreasing ? colors.danger : colors.textSecondary;

  const media = safeFloat(voltageStats?.media);
  const desvio = safeFloat(voltageStats?.desvioPadrao);
  const mediana = safeFloat(voltageStats?.boxPlot?.mediana) ?? safeFloat(voltageStats?.mediana);
  const moda = safeFloat(voltageStats?.moda);
  const desvioAlert = media != null && desvio != null ? (desvio / media) > 0.05 : false;

  const custoRealNum = safeFloat(custoReal);
  const consumoKwh =
    custoRealNum != null ? (custoRealNum / TARIFA_KWH).toFixed(2).replace(".", ",") : null;

  const fpMedia = safeFloat(fatorPotenciaStats?.media);
  const fpEficiente = fpMedia != null && fpMedia >= FATOR_POTENCIA_LIMITE;
  const fpColor = fpEficiente ? colors.success : colors.danger;
  const fpLabel = fpEficiente ? "Eficiente" : "Atenção";

  const freqMedia = safeFloat(frequenciaStats?.media);
  const freqEstavel =
    freqMedia != null && freqMedia >= FREQUENCIA_ESTAVEL_MIN && freqMedia <= FREQUENCIA_ESTAVEL_MAX;
  const freqColor = freqEstavel ? colors.success : colors.danger;
  const freqLabel = freqEstavel ? "Estável" : "Instável";

  return (
    <>
      <div className={styles.kpiRow}>
        {/* 1. Custo Real Acumulado */}
        <KPICard
          flex={1.4}
          delay={0}
          accent={colors.danger}
          icon={<DollarIcon />}
          label="Custo Real"
          prefix="R$"
          value={fmt(custoReal)}
          sub={
            consumoKwh !== null ? (
              <span className={styles.subValue}>
                Acumulado:{" "}
                <span className={styles.subValueStrong}>{consumoKwh} kWh</span>
              </span>
            ) : null
          }
        />

        {/* 2. Previsão Mensal */}
        <KPICard
          flex={1.2}
          delay={0.05}
          accent={colors.warning}
          icon={<TrendUpIcon />}
          label="Previsão Mensal"
          prefix="R$"
          value={fmt(previsao)}
          badge={
            trend ? (
              <span
                className={styles.badge}
                style={{
                  color: trendColor,
                  borderColor: `${trendColor}40`,
                  background: `${trendColor}10`,
                }}
              >
                {isIncreasing ? <ArrowUpIcon color={trendColor} /> : <MinusIcon color={trendColor} />}
                {trend}
              </span>
            ) : null
          }
        />

        {/* 3. Fator de Potência */}
        <KPICard
          flex={1}
          delay={0.1}
          accent={colors.purple}
          icon={<PulseIcon />}
          label="Fator de Potência"
          value={fpMedia != null ? fpMedia.toFixed(2) : "—"}
          badge={
            fpMedia != null ? (
              <span
                className={styles.badge}
                style={{
                  color: fpColor,
                  borderColor: `${fpColor}40`,
                  background: `${fpColor}10`,
                }}
                title={
                  fpEficiente
                    ? `Acima de ${FATOR_POTENCIA_LIMITE} — sem cobrança de multa`
                    : `Abaixo de ${FATOR_POTENCIA_LIMITE} — passível de multa pela concessionária`
                }
              >
                {fpEficiente ? <CheckIcon color={fpColor} /> : <AlertIcon color={fpColor} />}
                {fpLabel}
              </span>
            ) : null
          }
        />

        {/* 4. Frequência */}
        <KPICard
          flex={1}
          delay={0.15}
          accent={colors.info}
          icon={<SpeedometerIcon />}
          label="Frequência"
          value={freqMedia != null ? freqMedia.toFixed(2) : "—"}
          prefix={freqMedia != null ? "Hz" : null}
          badge={
            freqMedia != null ? (
              <span
                className={styles.badge}
                style={{
                  color: freqColor,
                  borderColor: `${freqColor}40`,
                  background: `${freqColor}10`,
                }}
                title={`Faixa estável: ${FREQUENCIA_ESTAVEL_MIN}–${FREQUENCIA_ESTAVEL_MAX} Hz`}
              >
                {freqEstavel ? <CheckIcon color={freqColor} /> : <AlertIcon color={freqColor} />}
                {freqLabel}
              </span>
            ) : null
          }
        />

        {/* 5. Status do Aparelho */}
        <DeviceStatusCard lastReading={lastReading} />
      </div>

      {/* 6. Qualidade da Tensão (full-width) */}
      <motion.div
        className={styles.voltageCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: "easeOut" }}
      >
        <div className={styles.accent} style={{ background: colors.primary }} />
        <div className={styles.voltageBody}>
          <div className={styles.voltageHeader}>
            <div
              className={styles.iconBox}
              style={{ color: colors.primary, background: `${colors.primary}1A` }}
            >
              <ZapIcon />
            </div>
            <div>
              <span className={styles.label}>Qualidade da Tensão</span>
              <p className={styles.voltageDesc}>
                Distribuição estatística das leituras de voltagem da rede elétrica
              </p>
            </div>
          </div>

          {voltageStats ? (
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Média</span>
                <span className={styles.statValue}>{fmt(media, 1)} V</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Mediana</span>
                <span className={styles.statValue}>{fmt(mediana, 1)} V</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Moda</span>
                <span className={styles.statValue}>{fmt(moda, 1)} V</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Desvio</span>
                <span
                  className={styles.statValue}
                  style={{ color: desvioAlert ? colors.danger : colors.textPrimary }}
                >
                  ±{fmt(desvio, 2)} V
                </span>
                {desvioAlert && (
                  <span className={styles.statHint} style={{ color: colors.danger }}>
                    Oscilação acima de 5%
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className={styles.noData}>Sem dados de tensão</span>
          )}
        </div>
      </motion.div>
    </>
  );
}

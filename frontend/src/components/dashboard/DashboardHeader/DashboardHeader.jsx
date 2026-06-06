import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DashboardHeader.module.css";

function RefreshIcon({ spinning }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: spinning ? "spin 0.8s linear infinite" : "none" }}
    >
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
    </svg>
  );
}

export default function DashboardHeader({ status = "offline", lastUpdate = "—", refreshing, onRefresh, live = false }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("pt-BR"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR"));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = status === "online";
  const accent = isOnline ? "var(--color-success)" : "var(--color-danger)";

  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.left}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Monitoramento energético em tempo real</p>
      </div>

      <div className={styles.right}>
        <div className={styles.statusCard}>
          <span
            className={styles.statusDot}
            style={{
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
          <span className={styles.statusLabel} style={{ color: accent }}>
            {isOnline ? "Sistema Online" : "Sistema Offline"}
          </span>
          <button
            className={styles.refreshBtn}
            onClick={onRefresh}
            disabled={refreshing}
            title="Atualizar dados"
            aria-label="Atualizar dados"
          >
            <RefreshIcon spinning={refreshing} />
          </button>
        </div>

        <div className={styles.meta}>
          <AnimatePresence>
            {live && (
              <motion.span
                key="live"
                className={styles.liveBadge}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <span className={styles.livePulse} />
                AO VIVO
              </motion.span>
            )}
          </AnimatePresence>
          <span className={styles.timestamp}>
            {isOnline ? `Última leitura: ${lastUpdate}` : `Atualizado: ${time}`}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

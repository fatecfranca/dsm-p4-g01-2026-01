import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DeviceStatusBadge from "../DeviceStatusBadge/DeviceStatusBadge";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({ status = "offline", lastUpdate = "—", refreshing, onRefresh, lastReading }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("pt-BR"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR"));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = status === "online";

  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.left}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Monitoramento energético em tempo real
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.statusGroup}>
          <div className={styles.badgesRow}>
            <div
              className={styles.statusBadge}
              style={{
                background: isOnline
                  ? "rgba(34, 197, 94, 0.08)"
                  : "rgba(239, 68, 68, 0.08)",
                borderColor: isOnline
                  ? "rgba(34, 197, 94, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
              }}
            >
              <span
                className={styles.statusDot}
                style={{
                  background: isOnline ? "var(--color-success)" : "var(--color-danger)",
                  boxShadow: isOnline
                    ? "0 0 10px rgba(34, 197, 94, 0.5)"
                    : "0 0 10px rgba(239, 68, 68, 0.5)",
                }}
              />
              <span
                className={styles.statusLabel}
                style={{
                  color: isOnline ? "var(--color-success)" : "var(--color-danger)",
                }}
              >
                {isOnline ? "Sistema Online" : "Sistema Offline"}
              </span>
              <button
                className={styles.refreshBtn}
                onClick={onRefresh}
                disabled={refreshing}
                title="Atualizar dados"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
                </svg>
              </button>
            </div>

            {isOnline && <DeviceStatusBadge lastReading={lastReading} />}
          </div>

          <span className={styles.timestamp}>
            {isOnline ? `Última leitura: ${lastUpdate}` : `Atualizado: ${time}`}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

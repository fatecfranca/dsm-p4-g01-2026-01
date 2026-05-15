import { motion } from "framer-motion";
import { systemInfo } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader() {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.left}>
        <h1 className={styles.title}>Dashboard de Monitoramento</h1>
        <p className={styles.subtitle}>
          Monitore em tempo real o consumo energético do seu sistema
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.dot} />
          <span className={styles.statusText}>Sistema Online</span>
        </div>
        <span className={styles.time}>
          Última leitura: {systemInfo.lastReading}
        </span>
      </div>
    </motion.header>
  );
}

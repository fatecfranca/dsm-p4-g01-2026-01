import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import KPICards from "../../components/dashboard/KPICards/KPICards";
import LineChart from "../../components/dashboard/LineChart/LineChart";
import BarChart from "../../components/dashboard/BarChart/BarChart";
import GaugeSection from "../../components/dashboard/GaugeSection/GaugeSection";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardHeader />
      <KPICards />

      <div className={styles.chartGrid}>
        <LineChart />
        <BarChart />
      </div>

      <div className={styles.bottomGrid}>
        <GaugeSection />
      </div>
    </motion.section>
  );
}

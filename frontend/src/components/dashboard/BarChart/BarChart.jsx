import { motion } from "framer-motion";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
} from "victory";
import { dailyConsumption } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./BarChart.module.css";

export default function BarChart() {
  const data = dailyConsumption;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Consumo por Dia da Semana</h3>
        <span className={styles.badge}>kWh</span>
      </div>

      <div className={styles.chartWrapper}>
        <VictoryChart
          height={220}
          padding={{ top: 20, bottom: 30, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickValues={data.map(d => d.day)}
            tickFormat={(t) => t}
            style={{
              axis: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: { fill: colors.textSecondary, fontSize: 10, fontFamily: 'Inter' },
              grid: { stroke: 'transparent' },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: colors.textSecondary, fontSize: 10, fontFamily: 'Inter' },
              grid: { stroke: '#1E293B', strokeWidth: 1 },
            }}
          />

          <VictoryBar
            data={data}
            x="day"
            y="consumption"
            barRatio={0.65}
            cornerRadius={{ top: 4 }}
            style={{
              data: {
                fill: ({ datum }) => {
                  const maxVal = Math.max(...data.map(d => d.consumption));
                  const ratio = datum.consumption / maxVal;
                  if (ratio >= 0.9) return colors.danger;
                  if (ratio >= 0.7) return colors.warning;
                  return colors.primary;
                },
              },
            }}
            animate={{
              duration: 800,
              onLoad: { duration: 400 },
            }}
          />
        </VictoryChart>
      </div>
    </motion.div>
  );
}

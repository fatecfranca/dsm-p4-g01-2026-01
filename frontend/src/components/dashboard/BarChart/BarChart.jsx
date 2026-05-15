import { motion } from "framer-motion";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import { dailyConsumption } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./BarChart.module.css";

export default function BarChart() {
  const data = dailyConsumption;
  const maxVal = Math.max(...data.map(d => d.consumption));

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
          height={230}
          padding={{ top: 30, bottom: 35, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickValues={data.map(d => d.day)}
            tickFormat={(t) => t}
            style={{
              axis: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: { fill: colors.textSecondary, fontSize: 9, fontFamily: 'Inter', padding: 6 },
              grid: { stroke: 'transparent' },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: colors.textSecondary, fontSize: 9, fontFamily: 'Inter', padding: 4 },
              grid: { stroke: '#1E293B', strokeWidth: 1 },
            }}
          />

          <VictoryBar
            data={data}
            x="day"
            y="consumption"
            barRatio={0.6}
            cornerRadius={{ top: 4 }}
            labels={({ datum }) => `${datum.consumption}`}
            labelComponent={
              <VictoryLabel
                dy={-8}
                style={{ fill: colors.textSecondary, fontSize: 10, fontFamily: 'Inter' }}
              />
            }
            style={{
              data: {
                fill: ({ datum }) => {
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

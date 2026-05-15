import { motion } from "framer-motion";
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from "victory";
import { powerTimeSeries } from "../../../mock/dashboardMockData";
import { colors } from "../../../theme/colors";
import styles from "./LineChart.module.css";

export default function LineChart() {
  const data = powerTimeSeries;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Potência Ativa vs Tempo</h3>
        <span className={styles.badge}>24 horas</span>
      </div>

      <div className={styles.chartWrapper}>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="powerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </svg>

        <VictoryChart
          height={260}
          padding={{ top: 20, bottom: 30, left: 50, right: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${datum.power}W`}
              labelComponent={
                <VictoryTooltip
                  style={{ fill: colors.textPrimary, fontSize: 11, fontFamily: 'Inter' }}
                  flyoutStyle={{
                    fill: colors.surface,
                    stroke: colors.border,
                    strokeWidth: 1,
                  }}
                />
              }
            />
          }
        >
          <VictoryAxis
            tickValues={data.filter((_, i) => i % 3 === 0).map(d => d.time)}
            tickFormat={(t) => t}
            style={{
              axis: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: { fill: colors.textSecondary, fontSize: 10, fontFamily: 'Inter' },
              grid: { stroke: '#1E293B', strokeWidth: 1 },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}W`}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: colors.textSecondary, fontSize: 10, fontFamily: 'Inter' },
              grid: { stroke: '#1E293B', strokeWidth: 1 },
            }}
          />

          <VictoryArea
            data={data}
            x="time"
            y="power"
            style={{
              data: {
                fill: 'url(#powerGradient)',
              },
            }}
          />

          <VictoryLine
            data={data}
            x="time"
            y="power"
            style={{
              data: {
                stroke: colors.primary,
                strokeWidth: 2,
                strokeLinecap: 'round',
              },
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>
      </div>
    </motion.div>
  );
}

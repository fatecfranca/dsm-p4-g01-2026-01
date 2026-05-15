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
  const tickValues = data.filter((_, i) => i % 4 === 0).map(d => d.time);
  const yMax = Math.max(...data.map(d => d.power));
  const yTicks = [0, Math.round(yMax / 2), yMax];

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
        <VictoryChart
          height={260}
          padding={{ top: 10, bottom: 45, left: 50, right: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${datum.power}W`}
              labelComponent={
                <VictoryTooltip
                  style={{ fill: colors.textPrimary, fontSize: 10, fontFamily: 'Inter' }}
                  flyoutStyle={{
                    fill: colors.surface,
                    stroke: colors.border,
                    strokeWidth: 1,
                  }}
                  flyoutPadding={{ top: 4, bottom: 4, left: 8, right: 8 }}
                  pointerLength={6}
                />
              }
            />
          }
        >
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={(t) => t}
            style={{
              axis: { stroke: colors.border, strokeWidth: 1 },
              axisLabel: { padding: 30 },
              tickLabels: { fill: colors.textSecondary, fontSize: 9, fontFamily: 'Inter', padding: 6 },
              grid: { stroke: 'transparent' },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickValues={yTicks}
            tickFormat={(t) => `${t}`}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: colors.textSecondary, fontSize: 9, fontFamily: 'Inter', padding: 4 },
              grid: { stroke: '#1E293B', strokeWidth: 1 },
            }}
          />

          <VictoryArea
            data={data}
            x="time"
            y="power"
            interpolation="monotoneX"
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
            interpolation="monotoneX"
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

import { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

const CHART_HEIGHT = 220;
const PADDING = { top: 30, right: 16, bottom: 16, left: 16 };

function formatVolt(v) {
  if (v == null) return '—';
  return Number(v).toFixed(1);
}

export default function BoxPlotChart({ descritiva, field = 'voltagem', label = 'Tensão', delay = 0 }) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const chartWidth = cardWidth - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const stats = descritiva?.[field];
  const box = stats?.boxPlot;

  const minV = box?.min ?? stats?.min;
  const maxV = box?.max ?? stats?.max;
  const domain = stats?.domain;
  const domainLow = domain?.[0] ?? minV;
  const domainHigh = domain?.[1] ?? maxV;

  const yScale = useMemo(() => {
    if (minV == null || maxV == null) return null;
    const low = domainLow != null ? domainLow : minV;
    const high = domainHigh != null ? domainHigh : maxV;
    const range = high - low || 1;
    return (v) => PADDING.top + chartHeight * (1 - (v - low) / range);
  }, [minV, maxV, domainLow, domainHigh, chartHeight]);

  if (!stats || !box || minV == null || maxV == null || !yScale) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>BoxPlot — {label}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados de {label.toLowerCase()}</Text>
        </View>
      </View>
    );
  }

  const cx = PADDING.left + chartWidth / 2;
  const bw = Math.min(chartWidth * 0.4, 80);
  const pMin = yScale(minV);
  const pMax = yScale(maxV);
  const pQ1 = yScale(box.q1);
  const pQ3 = yScale(box.q3);
  const pMed = yScale(box.mediana);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>BoxPlot — {label}</Text>
        <View style={styles.stats}>
          <Text style={styles.statItem}>
            Média: <Text style={styles.statValue}>{formatVolt(stats.media)} V</Text>
          </Text>
          <Text style={styles.statItem}>
            Desvio: <Text style={styles.statValue}>±{formatVolt(stats.desvioPadrao)} V</Text>
          </Text>
        </View>
      </View>

      <Svg width={cardWidth} height={CHART_HEIGHT}>
        {/* Whisker vertical (min-max) */}
        <Line
          x1={cx}
          y1={pMin}
          x2={cx}
          y2={pMax}
          stroke={colors.secondary}
          strokeWidth={1.5}
        />
        {/* Tampa min */}
        <Line
          x1={cx - bw * 0.35}
          y1={pMin}
          x2={cx + bw * 0.35}
          y2={pMin}
          stroke={colors.secondary}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Tampa max */}
        <Line
          x1={cx - bw * 0.35}
          y1={pMax}
          x2={cx + bw * 0.35}
          y2={pMax}
          stroke={colors.secondary}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Caixa Q1-Q3 */}
        <Rect
          x={cx - bw / 2}
          y={pQ3}
          width={bw}
          height={Math.max(pQ1 - pQ3, 1)}
          fill={colors.secondary}
          fillOpacity={0.15}
          stroke={colors.secondary}
          strokeWidth={1}
          rx={1}
        />
        {/* Mediana */}
        <Line
          x1={cx - bw / 2}
          y1={pMed}
          x2={cx + bw / 2}
          y2={pMed}
          stroke={colors.warning}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  stats: { flexDirection: 'row', gap: 10 },
  statItem: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  statValue: { color: colors.textPrimary, fontWeight: '700' },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

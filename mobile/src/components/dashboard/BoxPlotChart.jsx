import { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

const CHART_HEIGHT = 220;
const PADDING = { top: 36, right: 16, bottom: 24, left: 16 };

function formatValue(v) {
  if (v == null) return '—';
  return Number(v).toFixed(2);
}

function unitFor(field) {
  if (field === 'voltagem') return 'V';
  if (field === 'corrente') return 'A';
  if (field === 'potenciaAtiva') return 'W';
  if (field === 'frequencia') return 'Hz';
  if (field === 'fatorPotencia') return '';
  return '';
}

export default function BoxPlotChart({ descritiva, field = 'voltagem', label = 'Tensão' }) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const chartWidth = cardWidth - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const stats = descritiva?.[field];
  const box = stats?.boxPlot;
  const u = unitFor(field);

  const minV = box?.min ?? stats?.min;
  const maxV = box?.max ?? stats?.max;
  const domain = stats?.domain;
  const domainLow = domain?.[0] ?? minV;
  const domainHigh = domain?.[1] ?? maxV;

  const q1Raw = box?.q1;
  const q3Raw = box?.q3;
  const qLow = q1Raw != null && q3Raw != null ? Math.min(q1Raw, q3Raw) : q1Raw ?? q3Raw;
  const qHigh = q1Raw != null && q3Raw != null ? Math.max(q1Raw, q3Raw) : q1Raw ?? q3Raw;
  const mediana = box?.mediana;

  const yScale = useMemo(() => {
    if (minV == null || maxV == null) return null;
    const low = domainLow != null ? domainLow : minV;
    const high = domainHigh != null ? domainHigh : maxV;
    const range = high - low || 1;
    return (v) => PADDING.top + innerHeight * (1 - (v - low) / range);
  }, [minV, maxV, domainLow, domainHigh, innerHeight]);

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
  const pQ1 = yScale(qLow);
  const pQ3 = yScale(qHigh);
  const pMed = mediana != null ? yScale(mediana) : (pQ1 + pQ3) / 2;

  const boxTop = Math.min(pQ1, pQ3);
  const boxHeight = Math.max(Math.abs(pQ1 - pQ3), 4);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>BoxPlot — {label}</Text>
        <View style={styles.stats}>
          <Text style={styles.statItem}>
            Média: <Text style={styles.statValue}>{formatValue(stats.media)} {u}</Text>
          </Text>
          <Text style={styles.statItem}>
            Desvio: <Text style={styles.statValue}>±{formatValue(stats.desvioPadrao)} {u}</Text>
          </Text>
        </View>
      </View>

      <Svg width={cardWidth} height={CHART_HEIGHT}>
        {/* Eixo central referência (whisker) */}
        <Line
          x1={cx}
          y1={pMin}
          x2={cx}
          y2={pMax}
          stroke={colors.secondary}
          strokeWidth={1}
          strokeOpacity={0.4}
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
          y={boxTop}
          width={bw}
          height={boxHeight}
          fill={colors.secondary}
          fillOpacity={0.3}
          stroke={colors.secondary}
          strokeWidth={1.5}
          rx={3}
        />
        {/* Mediana */}
        <Line
          x1={cx - bw / 2 - 2}
          y1={pMed}
          x2={cx + bw / 2 + 2}
          y2={pMed}
          stroke={colors.warning}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.scale}>
        <Text style={styles.scaleItem}>
          Min: <Text style={styles.scaleValue}>{formatValue(minV)} {u}</Text>
        </Text>
        <Text style={styles.scaleItem}>
          Q1: <Text style={styles.scaleValue}>{formatValue(qLow)} {u}</Text>
        </Text>
        <Text style={styles.scaleItem}>
          Med: <Text style={styles.scaleValue}>{formatValue(mediana)} {u}</Text>
        </Text>
        <Text style={styles.scaleItem}>
          Q3: <Text style={styles.scaleValue}>{formatValue(qHigh)} {u}</Text>
        </Text>
        <Text style={styles.scaleItem}>
          Max: <Text style={styles.scaleValue}>{formatValue(maxV)} {u}</Text>
        </Text>
      </View>
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
    marginHorizontal: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  scaleItem: { fontSize: 9, color: colors.textMuted, fontWeight: '500' },
  scaleValue: { color: colors.textPrimary, fontWeight: '700' },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

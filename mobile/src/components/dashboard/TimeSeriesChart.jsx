import { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { G, Polyline, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';

const PADDING = { top: 16, right: 44, bottom: 32, left: 48 };

function formatTick(value) {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function TimeSeriesChart({ readings }) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const chartWidth = cardWidth - PADDING.left - PADDING.right;
  const chartHeight = 200;
  const innerHeight = chartHeight - PADDING.top - PADDING.bottom;

  const data = useMemo(() => {
    if (!readings?.length) return { points: [], multiDay: false, kw: { min: 0, max: 1 }, v: { min: 0, max: 1 }, tMin: 0, tMax: 1 };
    const sorted = [...readings]
      .filter((r) => r.potenciaKw != null && r.voltagem != null)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (sorted.length === 0) {
      return { points: [], multiDay: false, kw: { min: 0, max: 1 }, v: { min: 0, max: 1 }, tMin: 0, tMax: 1 };
    }

    const first = sorted[0]?.timestamp;
    const last = sorted[sorted.length - 1]?.timestamp;
    const multiDay = first?.slice(0, 10) !== last?.slice(0, 10);

    const kws = sorted.map((r) => r.potenciaKw);
    const vs = sorted.map((r) => r.voltagem);
    const kwMin = Math.min(...kws);
    const kwMax = Math.max(...kws);
    const vMin = Math.min(...vs);
    const vMax = Math.max(...vs);

    const tMin = new Date(first).getTime();
    const tMax = new Date(last).getTime();

    return {
      points: sorted.map((r) => ({ ...r, t: new Date(r.timestamp).getTime() })),
      multiDay,
      kw: { min: kwMin, max: kwMax === kwMin ? kwMin + 1 : kwMax },
      v: { min: vMin, max: vMax === vMin ? vMin + 1 : vMax },
      tMin,
      tMax: tMax === tMin ? tMin + 1 : tMax,
    };
  }, [readings]);

  if (data.points.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Linha do Tempo</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum dado de potência ou tensão disponível</Text>
        </View>
      </View>
    );
  }

  const tRange = data.tMax - data.tMin;
  const xFor = (t) => PADDING.left + ((t - data.tMin) / tRange) * chartWidth;
  const yKwFor = (v) => {
    const { min, max } = data.kw;
    return PADDING.top + innerHeight * (1 - (v - min) / (max - min));
  };
  const yVFor = (v) => {
    const { min, max } = data.v;
    return PADDING.top + innerHeight * (1 - (v - min) / (max - min));
  };

  const kwPoints = data.points.map((r) => `${xFor(r.t)},${yKwFor(r.potenciaKw)}`).join(' ');
  const vPoints = data.points.map((r) => `${xFor(r.t)},${yVFor(r.voltagem)}`).join(' ');

  const yTicks = 4;
  const kwTicks = Array.from({ length: yTicks + 1 }, (_, i) => data.kw.min + ((data.kw.max - data.kw.min) * i) / yTicks);
  const vTicks = Array.from({ length: yTicks + 1 }, (_, i) => data.v.min + ((data.v.max - data.v.min) * i) / yTicks);

  const xTickCount = 5;
  const xLabels = Array.from({ length: xTickCount + 1 }, (_, i) => {
    const t = data.tMin + (tRange * i) / xTickCount;
    const iso = new Date(t).toISOString();
    return { x: xFor(t), label: data.multiDay ? formatDateTime(iso) : formatTime(iso) };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Linha do Tempo</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { background: colors.primary }]} />
            <Text style={styles.legendText}>Potência (kW)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { background: colors.secondary }]} />
            <Text style={styles.legendText}>Tensão (V)</Text>
          </View>
        </View>
      </View>

      <Svg width={cardWidth} height={chartHeight}>
        {/* Grid horizontal */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const y = PADDING.top + (innerHeight * i) / yTicks;
          return (
            <Line
              key={`grid-${i}`}
              x1={PADDING.left}
              y1={y}
              x2={PADDING.left + chartWidth}
              y2={y}
              stroke={colors.borderLight}
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          );
        })}

        {/* Y axis labels - kW (left) */}
        {kwTicks.map((v, i) => {
          const y = PADDING.top + innerHeight * (1 - i / yTicks);
          return (
            <SvgText
              key={`kw-tick-${i}`}
              x={PADDING.left - 8}
              y={y + 3}
              fontSize={9}
              fill={colors.primary}
              textAnchor="end"
              fontWeight="600"
            >
              {formatTick(v)}
            </SvgText>
          );
        })}

        {/* Y axis labels - V (right) */}
        {vTicks.map((v, i) => {
          const y = PADDING.top + innerHeight * (1 - i / yTicks);
          return (
            <SvgText
              key={`v-tick-${i}`}
              x={PADDING.left + chartWidth + 8}
              y={y + 3}
              fontSize={9}
              fill={colors.secondary}
              textAnchor="start"
              fontWeight="600"
            >
              {formatTick(v)}
            </SvgText>
          );
        })}

        {/* X axis labels */}
        {xLabels.map((l, i) => (
          <SvgText
            key={`x-label-${i}`}
            x={l.x}
            y={chartHeight - 8}
            fontSize={9}
            fill={colors.textMuted}
            textAnchor="middle"
          >
            {l.label}
          </SvgText>
        ))}

        {/* Linha kW (verde) */}
        <Polyline
          points={kwPoints}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Linha V (azul) */}
        <Polyline
          points={vPoints}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={2.5}
          strokeLinejoin="round"
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
    marginHorizontal: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  legend: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

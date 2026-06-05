import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  Text as SvgText,
  Circle,
  G,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

const PADDING = { top: 24, right: 16, bottom: 36, left: 40 };
const CHART_HEIGHT = 180;
const MAX_POINTS = 32;

function formatTick(value, decimals) {
  if (value == null) return '';
  const n = Number(value);
  if (decimals != null) return n.toFixed(decimals);
  if (Math.abs(n) >= 100) return n.toFixed(0);
  if (Math.abs(n) >= 10) return n.toFixed(1);
  if (Math.abs(n) >= 1) return n.toFixed(2);
  return n.toFixed(3);
}

function formatLabel(iso, multiDay) {
  if (!iso) return '';
  const d = new Date(iso);
  if (multiDay) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function aggregate(readings, field, maxPoints) {
  if (!readings?.length) return [];
  const sorted = [...readings]
    .filter((r) => r[field] != null)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  if (sorted.length === 0) return [];
  if (sorted.length <= maxPoints) return sorted;
  const step = sorted.length / maxPoints;
  const result = [];
  for (let i = 0; i < maxPoints; i++) {
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.floor((i + 1) * step));
    const chunk = sorted.slice(start, end);
    if (chunk.length === 0) continue;
    const avg = chunk.reduce((s, r) => s + r[field], 0) / chunk.length;
    const mid = chunk[Math.floor(chunk.length / 2)];
    result.push({
      timestamp: mid.timestamp,
      [field]: avg,
    });
  }
  return result;
}

function buildSmoothPath(points, xFor, yFor) {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${xFor(points[0].t)} ${yFor(points[0].v)}`;
  }
  let path = `M ${xFor(points[0].t)} ${yFor(points[0].v)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const x1 = xFor(prev.t);
    const y1 = yFor(prev.v);
    const x2 = xFor(curr.t);
    const y2 = yFor(curr.v);
    const cx1 = x1 + (x2 - x1) * 0.4;
    const cy1 = y1;
    const cx2 = x1 + (x2 - x1) * 0.6;
    const cy2 = y2;
    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  }
  return path;
}

function buildAreaPath(linePath, points, xFor, baselineY) {
  if (points.length === 0) return '';
  return `${linePath} L ${xFor(points[points.length - 1].t)} ${baselineY} L ${xFor(points[0].t)} ${baselineY} Z`;
}

export default function MiniLineChart({
  readings,
  field,
  label,
  unit,
  color,
  decimals = 2,
}) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const chartWidth = cardWidth - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const baselineY = PADDING.top + innerHeight;
  const gradientId = `grad-${field}`;

  const data = useMemo(() => {
    const points = aggregate(readings, field, MAX_POINTS).map((r) => ({
      t: new Date(r.timestamp).getTime(),
      v: r[field],
      iso: r.timestamp,
    }));
    if (points.length === 0) {
      return { points: [], multiDay: false, min: 0, max: 1, current: null, avg: null };
    }
    const values = points.map((p) => p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const first = points[0].iso;
    const last = points[points.length - 1].iso;
    const multiDay = first?.slice(0, 10) !== last?.slice(0, 10);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const current = values[values.length - 1];
    return { points, multiDay, min, max, current, avg };
  }, [readings, field]);

  if (data.points.length === 0) {
    return (
      <View style={[styles.wrapper, { borderColor: `${color}33` }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.colorDot, { backgroundColor: color }]} />
            <Text style={styles.title}>{label}</Text>
          </View>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados de {label.toLowerCase()}</Text>
        </View>
      </View>
    );
  }

  const tMin = data.points[0].t;
  const tMax = data.points[data.points.length - 1].t;
  const tRange = tMax - tMin || 1;
  const vMin = data.min;
  const vMax = data.max;
  const vRange = vMax - vMin || 1;
  const vPad = vRange * 0.1;

  const xFor = (t) => PADDING.left + ((t - tMin) / tRange) * chartWidth;
  const yFor = (v) =>
    PADDING.top + innerHeight * (1 - (v - (vMin - vPad)) / (vRange + vPad * 2));

  const linePath = buildSmoothPath(data.points, xFor, yFor);
  const areaPath = buildAreaPath(linePath, data.points, xFor, baselineY);

  const yTickCount = 4;
  const ticks = Array.from({ length: yTickCount + 1 }, (_, i) => {
    const value = vMin - vPad + ((vRange + vPad * 2) * (yTickCount - i)) / yTickCount;
    const y = PADDING.top + (innerHeight * i) / yTickCount;
    return { value, y };
  });

  const xTickCount = data.multiDay ? 4 : 4;
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) => {
    const t = tMin + (tRange * i) / xTickCount;
    return { x: xFor(t), label: formatLabel(new Date(t).toISOString(), data.multiDay) };
  });

  const last = data.points[data.points.length - 1];
  const lastX = xFor(last.t);
  const lastY = yFor(last.v);

  return (
    <View style={[styles.wrapper, { borderColor: `${color}33` }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.title}>{label}</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatLabel}>Atual</Text>
            <Text style={[styles.headerStatValue, { color }]}>
              {formatTick(data.current, decimals)} {unit}
            </Text>
          </View>
        </View>
      </View>

      <Svg width={cardWidth} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        {ticks.map((t, i) => (
          <Line
            key={`grid-${i}`}
            x1={PADDING.left}
            y1={t.y}
            x2={PADDING.left + chartWidth}
            y2={t.y}
            stroke={colors.borderLight}
            strokeWidth={1}
            strokeDasharray="2,4"
          />
        ))}

        {ticks.map((t, i) => (
          <SvgText
            key={`y-tick-${i}`}
            x={PADDING.left - 4}
            y={t.y + 3}
            fontSize={9}
            fill={colors.textMuted}
            textAnchor="end"
            fontWeight="600"
          >
            {formatTick(t.value, decimals)}
          </SvgText>
        ))}

        {xTicks.map((t, i) => (
          <SvgText
            key={`x-tick-${i}`}
            x={t.x}
            y={CHART_HEIGHT - 8}
            fontSize={9}
            fill={colors.textMuted}
            textAnchor="middle"
          >
            {t.label}
          </SvgText>
        ))}

        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <Circle cx={lastX} cy={lastY} r={5} fill={color} stroke={colors.background} strokeWidth={2.5} />
        <Circle cx={lastX} cy={lastY} r={9} fill={color} fillOpacity={0.18} />
      </Svg>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Mín</Text>
          <Text style={styles.footerValue}>
            {formatTick(data.min, decimals)} <Text style={styles.footerUnit}>{unit}</Text>
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Média</Text>
          <Text style={styles.footerValue}>
            {formatTick(data.avg, decimals)} <Text style={styles.footerUnit}>{unit}</Text>
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Máx</Text>
          <Text style={styles.footerValue}>
            {formatTick(data.max, decimals)} <Text style={styles.footerUnit}>{unit}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  unit: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerStats: { flexDirection: 'row', gap: 12 },
  headerStat: { alignItems: 'flex-end' },
  headerStatLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerStatValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerItem: { flex: 1, alignItems: 'center' },
  footerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  footerUnit: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textMuted,
  },
  empty: { height: 140, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

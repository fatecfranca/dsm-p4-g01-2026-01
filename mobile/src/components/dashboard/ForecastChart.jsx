import { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Polygon, Polyline, Line, Text as SvgText, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const PADDING = { top: 24, right: 16, bottom: 28, left: 40 };
const CHART_HEIGHT = 200;

function formatBRL(value) {
  return `R$ ${Number(value).toFixed(2)}`;
}

function ArrowUp({ color }) {
  return <Ionicons name="trending-up" size={9} color={color} />;
}

function Minus({ color }) {
  return <Ionicons name="remove" size={9} color={color} />;
}

export default function ForecastChart({ preditiva }) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const chartWidth = cardWidth - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const ic = preditiva?.intervaloConfianca95;
  const previsaoRaw = preditiva?.previsaoFaturaMensal;
  const previsao = previsaoRaw ? parseFloat(previsaoRaw) : 0;
  const valMin = ic?.minimoEsperado ? parseFloat(ic.minimoEsperado) : previsao * 0.9;
  const valMax = ic?.maximoEsperado ? parseFloat(ic.maximoEsperado) : previsao * 1.1;

  const isIncreasing = preditiva?.tendenciaDeCusto === 'Aumentando';
  const trendColor = isIncreasing ? colors.danger : colors.textSecondary;
  const lineColor = isIncreasing ? colors.danger : colors.primary;

  const yPad = (valMax - valMin) * 0.2 || 1;
  const yMin = Math.max(0, valMin - yPad);
  const yMax = valMax + yPad;
  const yRange = yMax - yMin || 1;

  const xFor = (i) => PADDING.left + (chartWidth * i) / 2;
  const yFor = (v) => PADDING.top + innerHeight * (1 - (v - yMin) / yRange);

  const points = useMemo(() => {
    if (previsao <= 0) return null;
    return [
      { x: xFor(0), y: yFor(valMin), central: valMin, upper: valMin, lower: valMin, name: 'Mín' },
      { x: xFor(1), y: yFor(previsao), central: previsao, upper: valMax, lower: valMin, name: 'Previsto' },
      { x: xFor(2), y: yFor(valMax), central: valMax, upper: valMax, lower: valMax, name: 'Máx' },
    ];
  }, [previsao, valMin, valMax]);

  const upperPolyline = points ? `${points[0].x},${yFor(points[0].upper)} ${points[1].x},${yFor(points[1].upper)} ${points[2].x},${yFor(points[2].upper)}` : '';
  const lowerPolyline = points ? `${points[0].x},${yFor(points[0].lower)} ${points[1].x},${yFor(points[1].lower)} ${points[2].x},${yFor(points[2].lower)}` : '';
  const centralPolyline = points ? `${points[0].x},${yFor(points[0].central)} ${points[1].x},${yFor(points[1].central)} ${points[2].x},${yFor(points[2].central)}` : '';
  const areaPolygon = points
    ? `${points[0].x},${yFor(points[0].upper)} ${points[1].x},${yFor(points[1].upper)} ${points[2].x},${yFor(points[2].upper)} ${points[2].x},${yFor(points[2].lower)} ${points[1].x},${yFor(points[1].lower)} ${points[0].x},${yFor(points[0].lower)}`
    : '';

  if (!points) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Previsão Mensal IC 95%</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados preditivos</Text>
        </View>
      </View>
    );
  }

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Previsão Mensal IC 95%</Text>
        {preditiva?.tendenciaDeCusto && (
          <View
            style={[
              styles.badge,
              { borderColor: `${trendColor}4D`, background: `${trendColor}1A` },
            ]}
          >
            {isIncreasing ? <ArrowUp color={trendColor} /> : <Minus color={trendColor} />}
            <Text style={[styles.badgeText, { color: trendColor }]}>
              {preditiva.tendenciaDeCusto}
            </Text>
          </View>
        )}
      </View>

      <Svg width={cardWidth} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="icGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
            <Stop offset="95%" stopColor={lineColor} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Grid */}
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

        {/* Y axis labels */}
        {tickValues.map((v, i) => {
          const y = PADDING.top + innerHeight * (1 - i / yTicks);
          return (
            <SvgText
              key={`y-tick-${i}`}
              x={PADDING.left - 4}
              y={y + 3}
              fontSize={9}
              fill={colors.textMuted}
              textAnchor="end"
            >
              R$ {Math.round(v).toLocaleString('pt-BR')}
            </SvgText>
          );
        })}

        {/* Area do IC (faixa) */}
        <Polygon points={areaPolygon} fill="url(#icGrad)" />

        {/* Linha do upper bound */}
        <Polyline
          points={upperPolyline}
          fill="none"
          stroke={lineColor}
          strokeWidth={1}
          strokeOpacity={0.4}
          strokeDasharray="3,3"
        />
        {/* Linha do lower bound */}
        <Polyline
          points={lowerPolyline}
          fill="none"
          stroke={lineColor}
          strokeWidth={1}
          strokeOpacity={0.4}
          strokeDasharray="3,3"
        />

        {/* Linha central (Previsto) */}
        <Polyline
          points={centralPolyline}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pontos */}
        {points.map((p) => (
          <Rect
            key={`pt-${p.name}`}
            x={p.x - 4}
            y={p.y - 4}
            width={8}
            height={8}
            fill={lineColor}
            stroke={colors.backgroundAlt}
            strokeWidth={2}
            rx={1}
          />
        ))}

        {/* X axis labels */}
        {points.map((p) => (
          <SvgText
            key={`x-${p.name}`}
            x={p.x}
            y={CHART_HEIGHT - 8}
            fontSize={10}
            fill={colors.textSecondary}
            textAnchor="middle"
            fontWeight="600"
          >
            {p.name}
          </SvgText>
        ))}
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
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

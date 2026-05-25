import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Line, Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

const SIZE = Dimensions.get('window').width * 0.7;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const START_ANGLE = -180;
const END_ANGLE = 0;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArc, 0, end.x, end.y,
  ].join(' ');
}

function getGaugeColor(value) {
  if (value >= 0.85) return colors.primary;
  if (value >= 0.7) return colors.warning;
  return colors.danger;
}

export default function GaugeWidget({ frequency = 60, powerFactor = 0.95 }) {
  const clampedPf = Math.min(1, Math.max(0, powerFactor));
  const fillAngle = START_ANGLE + (END_ANGLE - START_ANGLE) * clampedPf;
  const gaugeColor = getGaugeColor(clampedPf);

  const bgArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, END_ANGLE);
  const fillArc = describeArc(CENTER, CENTER, RADIUS, START_ANGLE, fillAngle);

  const needleAngle = START_ANGLE + (END_ANGLE - START_ANGLE) * clampedPf;
  const needleLen = RADIUS * 0.7;
  const needleEnd = polarToCartesian(CENTER, CENTER, needleLen, needleAngle);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Saúde Elétrica</Text>

      <View style={styles.gaugeContainer}>
        <Svg width={SIZE} height={SIZE * 0.55} viewBox={`0 0 ${SIZE} ${SIZE * 0.55}`}>
          <G>
            <Path
              d={bgArc}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
            <Path
              d={fillArc}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
            <Line
              x1={CENTER}
              y1={CENTER}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={gaugeColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={8}
              fill={gaugeColor}
            />
            <SvgText
              x={CENTER}
              y={CENTER + 2}
              fill={colors.textSecondary}
              fontSize={13}
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {clampedPf.toFixed(2)}
            </SvgText>
          </G>
        </Svg>

        <Text style={styles.freqValue}>{frequency.toFixed(1)} Hz</Text>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Normal (≥0.85)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Atenção (0.70–0.84)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Ruim (&lt;0.70)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  freqValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

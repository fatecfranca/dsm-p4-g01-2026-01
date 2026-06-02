import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';

export default function LineChartWidget({
  data,
  peakIndex,
  title = 'Gráfico',
  unit = '',
  lineColor = colors.primary,
  peakLabel = 'Pico',
}) {
  if (!data || data.length === 0) return null;

  const { width } = useWindowDimensions();
  const chartWidth = width - 72;

  const labels = data.map((d) => d.time);
  const values = data.map((d) => d.value);
  const safePeakIndex = peakIndex >= 0 && peakIndex < values.length ? peakIndex : 0;
  const peakValue = values.length > 0 ? values[safePeakIndex] : 0;

  const hasHeader = title !== '';

  const chartData = {
    labels: labels.filter((_, i) => i % 5 === 0),
    datasets: [
      {
        data: values.length > 0 ? values : [0],
        color: () => lineColor,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.wrapper}>
      {hasHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {peakIndex >= 0 && (
            <View style={[styles.peakBadge, { backgroundColor: `${lineColor}20` }]}>
              <Text style={[styles.peakText, { color: lineColor }]}>
                {peakLabel}: {typeof peakValue === 'number' ? peakValue.toFixed(1) : peakValue}{unit}
              </Text>
            </View>
          )}
        </View>
      )}

      <LineChart
        data={chartData}
        width={chartWidth}
        height={200}
        yAxisSuffix={unit ? ` ${unit}` : ''}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#0F172A',
          backgroundGradientTo: '#0A1120',
          decimalCount: 1,
          color: () => lineColor,
          labelColor: () => colors.textMuted,
          propsForDots: {
            r: '3',
            strokeWidth: '1',
            stroke: lineColor,
          },
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: 'rgba(255,255,255,0.05)',
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLabels
        fromZero={false}
        segments={4}
      />
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
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  peakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  peakText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chart: {
    borderRadius: 12,
  },
});

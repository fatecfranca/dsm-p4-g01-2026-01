import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function LineChartWidget({ data, peakIndex }) {
  if (!data || data.length === 0) return null;

  const labels = data.map((d) => d.time);
  const values = data.map((d) => d.watts);
  const peakValue = values[peakIndex];

  const chartData = {
    labels: labels.filter((_, i) => i % 5 === 0),
    datasets: [
      {
        data: values,
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Potência em Tempo Real</Text>
        <View style={styles.peakBadge}>
          <Text style={styles.peakText}>Pico: {peakValue}W</Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        yAxisSuffix="W"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#0F172A',
          backgroundGradientTo: '#0A1120',
          decimalCount: 0,
          color: () => colors.primary,
          labelColor: () => colors.textMuted,
          propsForDots: {
            r: '3',
            strokeWidth: '1',
            stroke: colors.primary,
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
        onDataPointClick={({ value, index }) => {}}
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
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  peakText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  chart: {
    borderRadius: 12,
  },
});

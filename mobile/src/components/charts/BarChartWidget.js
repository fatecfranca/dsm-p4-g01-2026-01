import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function BarChartWidget({
  data,
  maxIndex,
  title = 'Gráfico',
  unit = '',
  barColor = colors.primary,
  highlightColor = '#F59E0B',
  formatTopValue,
}) {
  if (!data || data.length === 0) return null;

  const labels = data.map((d) => d.day);
  const values = data.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        colors: values.map((_, i) =>
          i === maxIndex
            ? (opacity = 1) => `rgba(245, 158, 11, ${opacity})`
            : (opacity = 1) => {
                const r = parseInt(barColor.slice(1, 3), 16);
                const g = parseInt(barColor.slice(3, 5), 16);
                const b = parseInt(barColor.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
              }
        ),
      },
    ],
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        yAxisSuffix={unit}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#0F172A',
          backgroundGradientTo: '#0A1120',
          decimalCount: unit === 'R$' ? 2 : 1,
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          labelColor: () => colors.textMuted,
          barPercentage: 0.6,
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: 'rgba(255,255,255,0.05)',
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        style={styles.chart}
        withInnerLines
        withVerticalLabels
        withHorizontalLabels
        showValuesOnTopOfBars
        fromZero
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
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chart: {
    borderRadius: 12,
  },
});

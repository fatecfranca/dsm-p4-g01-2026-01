import { View, Text, StyleSheet } from 'react-native';
import MiniLineChart from './MiniLineChart';
import { colors } from '../../theme/colors';

export default function TimeSeriesChart({ readings }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Linha do Tempo</Text>
        <Text style={styles.subtitle}>Potência e tensão ao longo do período</Text>
      </View>

      <View style={styles.chartList}>
        <MiniLineChart
          readings={readings}
          field="potenciaKw"
          label="Potência"
          unit="kW"
          color={colors.primary}
          decimals={3}
        />
        <MiniLineChart
          readings={readings}
          field="voltagem"
          label="Tensão"
          unit="V"
          color={colors.secondary}
          decimals={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  header: { marginBottom: 12, paddingHorizontal: 4 },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chartList: {
    gap: 12,
  },
});

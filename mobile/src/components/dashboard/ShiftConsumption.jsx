import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const SHIFT_META = [
  { key: 'madrugada', label: 'Madrugada', color: '#4F46E5', hours: '00h–06h' },
  { key: 'manha', label: 'Manhã', color: '#F59E0B', hours: '06h–12h' },
  { key: 'tarde', label: 'Tarde', color: '#F97316', hours: '12h–18h' },
  { key: 'noite', label: 'Noite', color: '#3B82F6', hours: '18h–00h' },
];

function formatKWh(value) {
  if (value == null) return '—';
  if (value >= 100) return value.toFixed(0);
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(3);
}

function shiftIcon(key, color) {
  if (key === 'madrugada' || key === 'noite') return <Ionicons name="moon-outline" size={12} color={color} />;
  if (key === 'manha') return <Ionicons name="sunny-outline" size={12} color={color} />;
  return <Ionicons name="partly-sunny-outline" size={12} color={color} />;
}

export default function ShiftConsumption({ consumoPorTurno }) {
  const data = useMemo(() => {
    if (!consumoPorTurno) return [];
    return SHIFT_META
      .map((s) => ({
        value: consumoPorTurno[s.key] || 0,
        color: s.color,
        key: s.key,
      }))
      .filter((d) => d.value > 0);
  }, [consumoPorTurno]);

  const total = useMemo(() => data.reduce((a, d) => a + d.value, 0), [data]);
  const dominant = useMemo(() => (data.length > 0 ? data.reduce((a, d) => (d.value > a.value ? d : a), data[0]) : null), [data]);

  if (data.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Consumo por Turno</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sem dados de estratificação</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Consumo por Turno</Text>
        {dominant && (
          <View
            style={[
              styles.peakBadge,
              {
                background: `${dominant.color}1F`,
                borderColor: `${dominant.color}4D`,
              },
            ]}
          >
            <Text style={[styles.peakText, { color: dominant.color }]}>
              Pico: {SHIFT_META.find((s) => s.key === dominant.key)?.label}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartRow}>
        <View style={styles.pieWrap}>
          <PieChart
            data={data}
            donut
            radius={70}
            innerRadius={46}
            innerCircleColor={colors.backgroundAlt}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.centerValue}>{formatKWh(total)}</Text>
                <Text style={styles.centerSub}>kWh total</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.legend}>
          {SHIFT_META.map((s) => {
            const v = consumoPorTurno[s.key] || 0;
            const pct = total > 0 ? (v / total) * 100 : 0;
            return (
              <View key={s.key} style={styles.legendItem}>
                <View style={styles.legendHeader}>
                  {shiftIcon(s.key, s.color)}
                  <Text style={styles.legendName}>{s.label}</Text>
                  <Text style={[styles.legendValue, { color: s.color }]}>
                    {formatKWh(v)} kWh
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: s.color },
                    ]}
                  />
                </View>
                <Text style={styles.legendMeta}>
                  {s.hours} · {pct.toFixed(1)}%
                </Text>
              </View>
            );
          })}
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
    borderRadius: 12,
    padding: 16,
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
  peakBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  peakText: { fontSize: 10, fontWeight: '700' },
  chartRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  pieWrap: { width: 140, alignItems: 'center', justifyContent: 'center' },
  centerLabel: { alignItems: 'center', justifyContent: 'center' },
  centerValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, lineHeight: 18 },
  centerSub: { fontSize: 9, color: colors.textSecondary, marginTop: 1 },
  legend: { flex: 1, gap: 6 },
  legendItem: { gap: 2 },
  legendHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendName: { fontSize: 11, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  legendValue: { fontSize: 11, fontWeight: '700' },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  legendMeta: { fontSize: 9, color: colors.textSecondary },
  empty: { height: 160, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: 12 },
});

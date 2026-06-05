import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const PRESETS = [
  { key: 'all', label: 'Todas' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
];

function toDateInput(iso) {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function extractMonths(readings) {
  const set = new Set();
  (readings || []).forEach((r) => {
    const d = r.timestamp?.slice(0, 7);
    if (d) set.add(d);
  });
  return [...set].sort();
}

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]}/${y.slice(2)}`;
}

function fmtRange(start, end) {
  if (!start && !end) return 'Todas as leituras';
  const s = start ? start.split('-').reverse().join('/') : '—';
  const e = end ? end.split('-').reverse().join('/') : '—';
  return `${s} – ${e}`;
}

export default function FilterBar({ readings, dateRange, onDateRangeChange }) {
  const months = useMemo(() => extractMonths(readings), [readings]);
  const isCustom = dateRange.start || dateRange.end;

  const activeKey = (() => {
    if (!isCustom) return 'all';
    const now = new Date();
    const s = toDateInput(now.toISOString());
    const d7 = new Date();
    d7.setDate(d7.getDate() - 7);
    if (dateRange.start === toDateInput(d7.toISOString()) && dateRange.end === s) return '7d';
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    if (dateRange.start === toDateInput(d30.toISOString()) && dateRange.end === s) return '30d';
    return null;
  })();

  function applyPreset(key) {
    const now = new Date();
    const t = toDateInput(now.toISOString());
    switch (key) {
      case 'all':
        onDateRangeChange({ start: '', end: '' });
        return;
      case '7d': {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        onDateRangeChange({ start: toDateInput(d7.toISOString()), end: t });
        return;
      }
      case '30d': {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        onDateRangeChange({ start: toDateInput(d30.toISOString()), end: t });
        return;
      }
    }
  }

  function applyMonth(ym) {
    const [y, m] = ym.split('-').map(Number);
    const start = `${ym}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${ym}-${String(lastDay).padStart(2, '0')}`;
    onDateRangeChange({ start, end });
  }

  return (
    <View style={styles.bar}>
      <View style={styles.labelRow}>
        <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
        <Text style={styles.labelText}>Período</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsRow}
      >
        {PRESETS.map((p) => {
          const active = activeKey === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => applyPreset(p.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}

        {months.length > 0 && (
          <>
            <View style={styles.divider} />
            {months.map((ym) => {
              const active =
                dateRange.start === `${ym}-01` &&
                dateRange.end?.startsWith(ym);
              return (
                <TouchableOpacity
                  key={ym}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => applyMonth(ym)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {monthLabel(ym)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={styles.dateRow}>
        <View style={styles.dateGroup}>
          <Text style={styles.dateLabel}>De</Text>
          <TextInput
            style={styles.dateInput}
            value={dateRange.start}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.textMuted}
            maxLength={10}
            onChangeText={(v) => onDateRangeChange({ ...dateRange, start: v })}
          />
          <Text style={styles.dateDash}>–</Text>
          <Text style={styles.dateLabel}>Até</Text>
          <TextInput
            style={styles.dateInput}
            value={dateRange.end}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.textMuted}
            maxLength={10}
            onChangeText={(v) => onDateRangeChange({ ...dateRange, end: v })}
          />
        </View>
      </View>

      {isCustom ? (
        <View style={styles.tagRow}>
          <Ionicons name="filter" size={11} color={colors.secondary} />
          <Text style={styles.tag}>{fmtRange(dateRange.start, dateRange.end)}</Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => onDateRangeChange({ start: '', end: '' })}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 20,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pillActive: {
    backgroundColor: `${colors.secondary}26`,
    borderColor: colors.secondary,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  pillTextActive: { color: colors.secondary },
  divider: { width: 1, height: 18, backgroundColor: colors.borderLight, marginHorizontal: 4 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dateLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  dateInput: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 8,
    fontSize: 12,
    color: colors.textPrimary,
    minWidth: 0,
  },
  dateDash: { color: colors.textMuted, fontSize: 12 },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.secondary}1A`,
    borderColor: `${colors.secondary}4D`,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tag: { fontSize: 11, color: colors.secondary, fontWeight: '600' },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: `${colors.secondary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

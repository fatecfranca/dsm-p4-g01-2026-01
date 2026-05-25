import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function KpiCard({
  icon,
  iconColor = colors.primary,
  bgColor = colors.successBg,
  label,
  value,
  unit,
  subtitle,
  subtitleColor = colors.textSecondary,
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});

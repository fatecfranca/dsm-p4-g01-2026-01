import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PulseDot from './PulseDot';
import { colors } from '../theme/colors';

export default function StatusBadge({ online = true, label }) {
  return (
    <View style={[styles.badge, online ? styles.badgeOnline : styles.badgeOffline]}>
      <PulseDot
        size={8}
        color={online ? colors.success : colors.textMuted}
      />
      <Text style={[styles.text, online ? styles.textOnline : styles.textOffline]}>
        {label || (online ? 'Sistema Online' : 'Sistema Offline')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  badgeOnline: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(35,197,94,0.25)',
  },
  badgeOffline: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textOnline: {
    color: colors.success,
  },
  textOffline: {
    color: colors.danger,
  },
});

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

function PulsingDot({ color, pulsing }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!pulsing) return undefined;
    let frame;
    let start = Date.now();
    const tick = () => {
      const t = (Date.now() - start) % 1600;
      setPulse(t < 800 ? t / 800 : 1 - (t - 800) / 800);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pulsing]);

  if (!pulsing) {
    return <View style={[styles.statusDot, { background: color }]} />;
  }

  return (
    <View
      style={[
        styles.statusDot,
        {
          background: color,
          shadowColor: color,
          shadowOpacity: 0.4 + pulse * 0.4,
          shadowRadius: 6 + pulse * 8,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    />
  );
}

export default function DashboardHeader({
  status = 'offline',
  lastUpdate = '—',
  refreshing,
  onRefresh,
}) {
  const isOnline = status === 'online';
  const [now, setNow] = useState(() => new Date().toLocaleTimeString('pt-BR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().toLocaleTimeString('pt-BR'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Monitoramento energético em tempo real</Text>
      </View>

      <View style={styles.right}>
        <View
          style={[
            styles.statusBadge,
            {
              background: isOnline ? `${colors.success}14` : `${colors.danger}14`,
              borderColor: isOnline ? `${colors.success}33` : `${colors.danger}33`,
            },
          ]}
        >
          <PulsingDot color={isOnline ? colors.success : colors.danger} pulsing={isOnline} />
          <Text
            style={[
              styles.statusLabel,
              { color: isOnline ? colors.success : colors.danger },
            ]}
          >
            {isOnline ? 'Sistema Online' : 'Sistema Offline'}
          </Text>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={onRefresh}
            disabled={refreshing}
            activeOpacity={0.7}
          >
            <Ionicons
              name="refresh-outline"
              size={14}
              color={colors.textPrimary}
              style={refreshing ? styles.spinning : null}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.timestamp}>
          {isOnline ? `Última leitura: ${lastUpdate}` : `Atualizado: ${now}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 12,
  },
  left: { flexShrink: 1 },
  right: { alignItems: 'flex-end', gap: 6 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  refreshBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  spinning: { transform: [{ rotate: '0deg' }] },
  timestamp: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
});

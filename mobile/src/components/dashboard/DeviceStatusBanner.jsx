import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

function timeAgo(timestamp) {
  if (!timestamp) return null;
  const ms = Date.now() - new Date(timestamp).getTime();
  if (ms < 0) return null;
  const sec = Math.floor(ms / 1000);
  if (sec < 5) return 'agora mesmo';
  if (sec < 60) return `há ${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr} h`;
  const d = Math.floor(hr / 24);
  return `há ${d} d`;
}

function fmtKw(value) {
  if (value == null) return '—';
  const n = Number(value);
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}

export default function DeviceStatusBanner({ lastReading }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 30000);
    return () => clearInterval(t);
  }, []);

  if (!lastReading) {
    return (
      <View style={[styles.banner, styles.bannerIdle]}>
        <View style={[styles.iconBox, styles.iconBoxIdle]}>
          <Ionicons name="power-outline" size={28} color={colors.textMuted} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>STATUS DO APARELHO</Text>
          <Text style={[styles.title, { color: colors.textSecondary }]}>
            Sem dados ainda
          </Text>
          <Text style={styles.subtitle}>Aguardando primeira leitura do dispositivo</Text>
        </View>
      </View>
    );
  }

  const powerNum = Number(lastReading.potenciaKw);
  const deviceOn = Number.isFinite(powerNum) && powerNum > 0;
  const deviceInvalid = Number.isFinite(powerNum) && powerNum < 0;
  const powerKw = lastReading.potenciaKw;
  const ago = timeAgo(lastReading.timestamp);

  if (deviceInvalid) {
    return (
      <View style={[styles.banner, styles.bannerInvalid]}>
        <View style={[styles.iconBox, styles.iconBoxInvalid]}>
          <Ionicons name="alert-circle" size={28} color={colors.danger} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.danger }]}>STATUS DO APARELHO</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Leitura Inválida
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={11} color={colors.danger} />
              <Text style={[styles.metaValue, { color: colors.danger }]}>
                {fmtKw(powerKw)} kW
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={11} color={colors.textMuted} />
              <Text style={styles.metaLabel}>Última leitura {ago}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (deviceOn) {
    return (
      <View style={[styles.banner, styles.bannerOn]}>
        <View style={styles.glowWrap}>
          <View style={styles.glowOuter} />
          <View style={[styles.iconBox, styles.iconBoxOn]}>
            <Ionicons name="power" size={28} color={colors.success} />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.success }]}>STATUS DO APARELHO</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Aparelho Ligado
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={11} color={colors.success} />
              <Text style={[styles.metaValue, { color: colors.success }]}>
                {fmtKw(powerKw)} kW
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={11} color={colors.textMuted} />
              <Text style={styles.metaLabel}>Última leitura {ago}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.banner, styles.bannerOff]}>
      <View style={[styles.iconBox, styles.iconBoxOff]}>
        <Ionicons name="power-outline" size={28} color={colors.textMuted} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textMuted }]}>STATUS DO APARELHO</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Aparelho Desligado
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="leaf-outline" size={11} color={colors.textMuted} />
            <Text style={styles.metaLabel}>Standby · 0 W</Text>
          </View>
          {ago ? (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={11} color={colors.textMuted} />
                <Text style={styles.metaLabel}>Última leitura {ago}</Text>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
  },
  bannerOn: {
    backgroundColor: 'rgba(34,197,94,0.10)',
    borderColor: 'rgba(34,197,94,0.35)',
  },
  bannerOff: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.borderLight,
  },
  bannerInvalid: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderColor: 'rgba(239,68,68,0.35)',
  },
  bannerIdle: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.borderLight,
  },
  glowWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBoxOn: {
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: 'rgba(34,197,94,0.45)',
  },
  iconBoxOff: {
    backgroundColor: 'rgba(100,116,139,0.10)',
    borderColor: 'rgba(100,116,139,0.30)',
  },
  iconBoxInvalid: {
    backgroundColor: 'rgba(239,68,68,0.18)',
    borderColor: 'rgba(239,68,68,0.45)',
  },
  iconBoxIdle: {
    backgroundColor: 'rgba(100,116,139,0.10)',
    borderColor: 'rgba(100,116,139,0.30)',
  },
  content: { flex: 1, minWidth: 0 },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textInactive,
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const TARIFA_KWH = 0.85;

function fmt(value, decimals = 2) {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(decimals).replace('.', ',');
}

function SkeletonCard({ accent, fullWidth }) {
  return (
    <View style={[styles.card, fullWidth ? styles.cardFull : styles.cardHalf]}>
      <View style={[styles.accent, { background: accent, opacity: 0.35 }]} />
      <View style={styles.cardBody}>
        <View style={styles.skelIcon} />
        <View style={styles.skelContent}>
          <View style={styles.skelLabel} />
          <View style={styles.skelValue} />
        </View>
      </View>
    </View>
  );
}

function ArrowUp({ color }) {
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="trending-up" size={10} color={color} />
    </View>
  );
}

function Minus({ color }) {
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="remove" size={10} color={color} />
    </View>
  );
}

function Check({ color }) {
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="checkmark" size={10} color={color} />
    </View>
  );
}

function Alert({ color }) {
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="alert" size={10} color={color} />
    </View>
  );
}

export default function KPIEnergyBar({
  preditiva,
  voltageStats,
  fatorPotenciaStats,
  frequenciaStats,
  loading,
}) {
  if (loading) {
    return (
      <View style={styles.grid}>
        <View style={styles.topRow}>
          <SkeletonCard accent={colors.danger} />
          <SkeletonCard accent={colors.warning} />
        </View>
        <View style={styles.topRow}>
          <SkeletonCard accent={colors.purple} />
          <SkeletonCard accent={colors.info} />
        </View>
        <SkeletonCard accent={colors.primary} fullWidth />
      </View>
    );
  }

  const custoReal = preditiva?.custoAtualReal;
  const previsao = preditiva?.previsaoFaturaMensal;
  const trend = preditiva?.tendenciaDeCusto;
  const isIncreasing = trend === 'Aumentando';
  const trendColor = isIncreasing ? colors.danger : colors.textSecondary;

  const media = voltageStats?.media != null ? parseFloat(voltageStats.media) : null;
  const desvio = voltageStats?.desvioPadrao != null ? parseFloat(voltageStats.desvioPadrao) : null;
  const mediana = voltageStats?.boxPlot?.mediana != null
    ? parseFloat(voltageStats.boxPlot.mediana)
    : voltageStats?.mediana != null ? parseFloat(voltageStats.mediana) : null;
  const moda = voltageStats?.moda != null ? parseFloat(voltageStats.moda) : null;
  const desvioAlert = media && desvio ? desvio / media > 0.05 : false;

  const fpMedia = fatorPotenciaStats?.media != null
    ? parseFloat(fatorPotenciaStats.media)
    : null;
  const fpEficiente = fpMedia != null && fpMedia >= 0.92;
  const fpColor = fpEficiente ? colors.success : colors.danger;
  const fpLabel = fpEficiente ? 'Eficiente' : 'Atenção';

  const freqMedia = frequenciaStats?.media != null
    ? parseFloat(frequenciaStats.media)
    : null;
  const freqEstavel = freqMedia != null && freqMedia >= 59.5 && freqMedia <= 60.5;
  const freqColor = freqEstavel ? colors.success : colors.danger;
  const freqLabel = freqEstavel ? 'Estável' : 'Instável';

  const consumoKwh = custoReal != null ? (parseFloat(custoReal) / TARIFA_KWH).toFixed(2).replace('.', ',') : null;

  return (
    <View style={styles.grid}>
      <View style={styles.topRow}>
        {/* Card 1: Custo Real Acumulado */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={[styles.accent, { background: colors.danger }]} />
          <View style={styles.cardBody}>
            <View style={[styles.iconBox, { background: `${colors.danger}1A`, borderColor: `${colors.danger}33` }]}>
              <Ionicons name="cash-outline" size={20} color={colors.danger} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Custo Real</Text>
              <View style={styles.valueRow}>
                <Text style={styles.prefix}>R$</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                  {fmt(custoReal)}
                </Text>
              </View>
              {consumoKwh !== null ? (
                <Text style={styles.subValue}>
                  Acumulado: <Text style={styles.subValueStrong}>{consumoKwh} kWh</Text>
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Card 2: Previsão Mensal */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={[styles.accent, { background: colors.warning }]} />
          <View style={styles.cardBody}>
            <View style={[styles.iconBox, { background: `${colors.warning}1A`, borderColor: `${colors.warning}33` }]}>
              <Ionicons name="trending-up-outline" size={20} color={colors.warning} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Previsão Mensal</Text>
              <View style={styles.valueRow}>
                <Text style={styles.prefix}>R$</Text>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                  {fmt(previsao)}
                </Text>
              </View>
              {trend && (
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: `${trendColor}4D`,
                      background: `${trendColor}1A`,
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  {isIncreasing ? <ArrowUp color={trendColor} /> : <Minus color={trendColor} />}
                  <Text style={[styles.badgeText, { color: trendColor }]}>{trend}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.topRow}>
        {/* Card 3: Fator de Potência */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={[styles.accent, { background: colors.purple }]} />
          <View style={styles.cardBody}>
            <View style={[styles.iconBox, { background: `${colors.purple}1A`, borderColor: `${colors.purple}33` }]}>
              <Ionicons name="pulse-outline" size={20} color={colors.purple} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Fator de Potência</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                  {fpMedia != null ? fpMedia.toFixed(2) : '—'}
                </Text>
              </View>
              {fpMedia != null ? (
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: `${fpColor}4D`,
                      background: `${fpColor}1A`,
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  {fpEficiente ? <Check color={fpColor} /> : <Alert color={fpColor} />}
                  <Text style={[styles.badgeText, { color: fpColor }]}>{fpLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Card 4: Frequência da Rede */}
        <View style={[styles.card, styles.cardHalf]}>
          <View style={[styles.accent, { background: colors.info }]} />
          <View style={styles.cardBody}>
            <View style={[styles.iconBox, { background: `${colors.info}1A`, borderColor: `${colors.info}33` }]}>
              <Ionicons name="speedometer-outline" size={20} color={colors.info} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Frequência</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                  {freqMedia != null ? freqMedia.toFixed(2) : '—'}
                </Text>
                <Text style={styles.suffix}>Hz</Text>
              </View>
              {freqMedia != null ? (
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: `${freqColor}4D`,
                      background: `${freqColor}1A`,
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  {freqEstavel ? <Check color={freqColor} /> : <Alert color={freqColor} />}
                  <Text style={[styles.badgeText, { color: freqColor }]}>{freqLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      {/* Card 5: Qualidade da Tensão (full-width) */}
      <View style={[styles.card, styles.cardFull]}>
        <View style={[styles.accent, { background: colors.primary }]} />
        <View style={styles.cardBody}>
          <View style={[styles.iconBox, { background: `${colors.primary}1A`, borderColor: `${colors.primary}33` }]}>
            <Ionicons name="flash-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Qualidade da Tensão</Text>
            {voltageStats ? (
              <View style={styles.statsGrid}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Média</Text>
                  <Text style={styles.statValue}>{fmt(media, 1)} V</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Mediana</Text>
                  <Text style={styles.statValue}>{fmt(mediana, 1)} V</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Moda</Text>
                  <Text style={styles.statValue}>{fmt(moda, 1)} V</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Desvio</Text>
                  <Text
                    style={[
                      styles.statValue,
                      { color: desvioAlert ? colors.danger : colors.textPrimary },
                    ]}
                  >
                    ±{fmt(desvio, 2)} V
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noData}>Sem dados de tensão</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    minHeight: 96,
  },
  cardHalf: {
    flex: 1,
  },
  cardFull: {
    width: '100%',
  },
  accent: { height: 3, width: '100%' },
  cardBody: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: { flex: 1, justifyContent: 'center' },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  prefix: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  suffix: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  value: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, flexShrink: 1 },
  subValue: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 4,
  },
  subValueStrong: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  statsGrid: { gap: 3, marginTop: 2 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '500' },
  statValue: { fontSize: 11, fontWeight: '700', color: colors.textPrimary },
  noData: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },
  skelIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.borderLight },
  skelContent: { flex: 1, gap: 6, justifyContent: 'center' },
  skelLabel: { height: 8, width: '60%', borderRadius: 3, backgroundColor: colors.borderLight },
  skelValue: { height: 14, width: '40%', borderRadius: 3, backgroundColor: colors.borderLight },
});

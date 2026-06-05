import { useState, useEffect, useCallback } from 'react';
import { fetchTelemetria, fetchEstatisticas } from '../services/telemetriaService';

function formatLastUpdate(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function useDashboardData() {
  const [kpis, setKpis] = useState({ loading: true, error: null, data: null });
  const [graficoLinha, setGraficoLinha] = useState({
    loading: true,
    error: null,
    data: [],
    meta: null,
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [refreshing, setRefreshing] = useState(false);

  const loadKpis = useCallback(async ({ start, end } = {}) => {
    setKpis((prev) => ({ ...prev, loading: true }));
    try {
      const data = await fetchEstatisticas(undefined, start, end);
      setKpis({ loading: false, error: null, data });
    } catch (err) {
      const is404 = err?.status === 404;
      setKpis((prev) => ({
        loading: false,
        error: is404 ? null : err?.message || 'Erro ao carregar estatísticas',
        data: is404 ? prev.data : null,
      }));
    }
  }, []);

  const loadGraficoLinha = useCallback(async ({ start, end } = {}) => {
    setGraficoLinha((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchTelemetria(undefined, 1000, start, end);
      const data = result?.history || [];
      const meta = result?.insights || null;
      setGraficoLinha({ loading: false, error: null, data, meta });
    } catch (err) {
      const is404 = err?.status === 404;
      setGraficoLinha((prev) => ({
        loading: false,
        error: is404 ? null : err?.message || 'Erro ao carregar dados',
        data: is404 ? [] : prev.data,
        meta: is404 ? prev.meta : null,
      }));
    }
  }, []);

  useEffect(() => {
    const params =
      dateRange.start || dateRange.end ? dateRange : undefined;
    loadKpis(params);
    loadGraficoLinha(params);
  }, [dateRange, loadKpis, loadGraficoLinha]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const params =
      dateRange.start || dateRange.end ? dateRange : undefined;
    await Promise.all([loadKpis(params), loadGraficoLinha(params)]);
    setRefreshing(false);
  }, [loadKpis, loadGraficoLinha, dateRange]);

  const lastReading = graficoLinha.data?.[graficoLinha.data.length - 1];
  const lastUpdate = formatLastUpdate(lastReading?.timestamp);
  const status = (graficoLinha.data?.length || 0) > 0 ? 'online' : 'offline';

  return {
    kpis,
    graficoLinha,
    dateRange,
    setDateRange,
    refreshing,
    handleRefresh,
    lastUpdate,
    status,
  };
}

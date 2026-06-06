import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTelemetria, fetchEstatisticas } from '../services/telemetriaService';
import { HISTORY_LIMIT } from '../constants/config';

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
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [refreshing, setRefreshing] = useState(false);
  const kpisReqIdRef = useRef(0);
  const graficoReqIdRef = useRef(0);

  const loadKpis = useCallback(async ({ start, end } = {}) => {
    const myId = ++kpisReqIdRef.current;
    setKpis((prev) => ({ ...prev, loading: true }));
    try {
      const data = await fetchEstatisticas(undefined, start, end);
      if (myId !== kpisReqIdRef.current) return;
      setKpis({ loading: false, error: null, data });
    } catch (err) {
      if (myId !== kpisReqIdRef.current) return;
      const is404 = err?.status === 404;
      setKpis((prev) => ({
        loading: false,
        error: is404 ? null : err?.message || 'Erro ao carregar estatísticas',
        data: is404 ? prev.data : null,
      }));
    }
  }, []);

  const loadGraficoLinha = useCallback(async ({ start, end } = {}) => {
    const myId = ++graficoReqIdRef.current;
    setGraficoLinha((prev) => ({ ...prev, loading: true }));
    try {
      const result = await fetchTelemetria(undefined, HISTORY_LIMIT, start, end);
      if (myId !== graficoReqIdRef.current) return;
      const data = result?.history || [];
      setGraficoLinha({ loading: false, error: null, data });
    } catch (err) {
      if (myId !== graficoReqIdRef.current) return;
      const is404 = err?.status === 404;
      setGraficoLinha((prev) => ({
        loading: false,
        error: is404 ? null : err?.message || 'Erro ao carregar dados',
        data: is404 ? [] : prev.data,
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

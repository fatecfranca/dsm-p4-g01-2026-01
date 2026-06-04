import { useState, useEffect, useCallback, useRef } from 'react';
import { getEstatisticas } from '../services/telemetryService';

const INITIAL = {
  descritiva: null,
  estratificada: null,
  preditiva: null,
  loading: true,
  error: null,
};

export default function useEstatisticas(dispositivoId = 'ESP32_VENTILADOR') {
  const [state, setState] = useState(INITIAL);
  const dispositivoRef = useRef(dispositivoId);

  const refresh = useCallback(async () => {
    try {
      const data = await getEstatisticas(dispositivoId);
      setState({
        descritiva: data.descritiva || null,
        estratificada: data.estratificada || null,
        preditiva: data.preditiva || null,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Falha ao carregar estatísticas',
      }));
    }
  }, [dispositivoId]);

  useEffect(() => {
    setState(INITIAL);
    dispositivoRef.current = dispositivoId;
    refresh();
  }, [refresh, dispositivoId]);

  return { ...state, refresh };
}

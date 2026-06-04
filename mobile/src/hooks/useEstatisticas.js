import { useState, useEffect, useCallback, useRef } from "react";
import { getEstatisticas } from "../services/telemetryService";

const INITIAL = {
  descritiva: null,
  estratificada: null,
  preditiva: null,
  loading: true,
  error: null,
};

export default function useEstatisticas(
  dispositivoId = "ESP32_VENTILADOR",
  dataInicio,
  dataFim,
) {
  const [state, setState] = useState(INITIAL);
  const dispositivoRef = useRef(dispositivoId);

  const refresh = useCallback(async () => {
    try {
      const data = await getEstatisticas(dispositivoId, dataInicio, dataFim);
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
        error: err.message || "Falha ao carregar estatísticas",
      }));
    }
  }, [dispositivoId, dataInicio, dataFim]);

  useEffect(() => {
    setState(INITIAL);
    dispositivoRef.current = dispositivoId;
    refresh();
  }, [refresh, dispositivoId, dataInicio, dataFim]);

  return { ...state, refresh };
}

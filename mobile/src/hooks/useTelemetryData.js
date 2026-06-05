import { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getTelemetria, getTarifa } from "../services/telemetryService";
import useWebSocket from "./useWebSocket";

const TARIFA = getTarifa();
const MAX_READINGS = 500;

function getPeakIndex(data) {
  if (!data || data.length === 0) return 0;
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].value > data[maxIdx].value) maxIdx = i;
  }
  return maxIdx;
}

function buildSeries(readings, field, fallback = 0) {
  return readings.map((r) => {
    const d = new Date(r.timestamp);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return {
      time: `${h}:${m}`,
      value: r[field] ?? fallback,
    };
  });
}

function buildStateFromReadings(readings) {
  const sorted = [...readings];
  const latest = sorted[sorted.length - 1];

  if (!latest) return null;

  const voltageData = buildSeries(sorted, "voltagem");
  const currentData = buildSeries(sorted, "corrente");
  const activePowerData = buildSeries(sorted, "potenciaAtiva");
  const apparentPowerData = buildSeries(sorted, "potenciaAparente");
  const reactivePowerData = buildSeries(sorted, "potenciaReativa");
  const powerFactorData = buildSeries(sorted, "fatorPotencia");
  const frequencyData = buildSeries(sorted, "frequencia");
  const powerKwData = buildSeries(sorted, "potenciaKw");
  const costHourData = buildSeries(sorted, "custoHora");

  const lastTimestamp = latest.timestamp
    ? new Date(latest.timestamp).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  const latestKw = latest.potenciaKw ?? latest.potenciaAtiva / 1000;
  const monthlyCost = +(latest.custoHora * 24 * 30).toFixed(2) || 0;

  return {
    voltageData,
    currentData,
    activePowerData,
    apparentPowerData,
    reactivePowerData,
    powerFactorData,
    frequencyData,
    powerKwData,
    costHourData,
    voltage: latest.voltagem ?? 0,
    current: latest.corrente ?? 0,
    power: latest.potenciaAtiva ?? 0,
    powerKw: latestKw,
    costHora: latest.custoHora ?? 0,
    powerFactor: latest.fatorPotencia ?? 0,
    frequency: latest.frequencia ?? 0,
    lastTimestamp,
    peakVoltageIndex: getPeakIndex(voltageData),
    peakCurrentIndex: getPeakIndex(currentData),
    peakPowerIndex: getPeakIndex(activePowerData),
    peakApparentPowerIndex: getPeakIndex(apparentPowerData),
    peakReactivePowerIndex: getPeakIndex(reactivePowerData),
    peakPowerKwIndex: getPeakIndex(powerKwData),
    peakCostHourIndex: getPeakIndex(costHourData),
    monthlyCost,
    readings: sorted,
    loading: false,
    error: null,
  };
}

const INITIAL = {
  voltageData: [],
  currentData: [],
  activePowerData: [],
  apparentPowerData: [],
  reactivePowerData: [],
  powerFactorData: [],
  frequencyData: [],
  powerKwData: [],
  costHourData: [],
  voltage: 0,
  current: 0,
  power: 0,
  powerKw: 0,
  costHora: 0,
  powerFactor: 0,
  frequency: 0,
  lastTimestamp: "",
  peakVoltageIndex: 0,
  peakCurrentIndex: 0,
  peakPowerIndex: 0,
  peakApparentPowerIndex: 0,
  peakReactivePowerIndex: 0,
  peakPowerKwIndex: 0,
  peakCostHourIndex: 0,
  monthlyCost: 0,
  readings: [],
  loading: true,
  error: null,
};

export default function useTelemetryData(
  dispositivoId = "ESP32_VENTILADOR",
  limite = 100,
  dataInicio,
  dataFim,
) {
  const [state, setState] = useState(INITIAL);
  const stateRef = useRef(state);
  const [isFocused, setIsFocused] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await getTelemetria(
        dispositivoId,
        limite,
        dataInicio,
        dataFim,
      );
      const readings = response.history || [];
      if (readings.length === 0) {
        throw new Error("Nenhuma leitura disponível");
      }

      const newState = {
        ...buildStateFromReadings(readings),
        loading: false,
        error: null,
      };

      stateRef.current = newState;
      setState(newState);
    } catch (err) {
      const prev = stateRef.current;
      setState({
        ...prev,
        loading: false,
        error: err.message || "Falha ao conectar com o servidor",
      });
    }
  }, [dispositivoId, limite, dataInicio, dataFim]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      refresh();
      return () => setIsFocused(false);
    }, [refresh]),
  );

  const handleWsMessage = useCallback(
    (msg) => {
      if (msg.tipo !== "novaLeitura") return;
      const leitura = msg.dados;
      if (leitura.dispositivoId !== dispositivoId) return;

      setState((prev) => {
        if (prev.readings.length === 0) return prev;

        const readings = [...prev.readings, leitura];
        if (readings.length > MAX_READINGS) {
          readings.splice(0, readings.length - MAX_READINGS);
        }

        const newState = {
          ...buildStateFromReadings(readings),
          loading: false,
          error: null,
        };

        stateRef.current = newState;
        return newState;
      });
    },
    [dispositivoId],
  );

  useWebSocket(handleWsMessage, isFocused);

  return { ...state, refresh };
}

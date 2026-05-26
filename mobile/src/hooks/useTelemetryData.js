import { useState, useEffect, useCallback, useRef } from 'react';
import { getTelemetria } from '../services/telemetryService';

function getPeakIndex(data) {
  if (!data || data.length === 0) return 0;
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].value > data[maxIdx].value) maxIdx = i;
  }
  return maxIdx;
}

function buildTimeSeries(readings, field) {
  return readings.map((r) => {
    const d = new Date(r.timestamp);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return { time: `${h}:${m}`, value: r[field] ?? 0 };
  });
}

function buildDailyData(readings, field) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const byDay = {};
  readings.forEach((r) => {
    const d = new Date(r.timestamp);
    const dayName = days[d.getDay()];
    if (!byDay[dayName]) byDay[dayName] = [];
    byDay[dayName].push(r[field] ?? 0);
  });
  return days.map((day) => ({
    day,
    value: byDay[day]
      ? +(byDay[day].reduce((a, b) => a + b, 0) / byDay[day].length).toFixed(1)
      : 0,
  }));
}

const INITIAL = {
  powerData: [],
  voltageData: [],
  currentData: [],
  dailyData: [],
  financialData: [],
  voltage: 0,
  current: 0,
  power: 0,
  monthlyCost: 0,
  frequency: 0,
  powerFactor: 0,
  peakPowerIndex: 0,
  peakVoltageIndex: 0,
  peakCurrentIndex: 0,
  maxKwhIndex: 0,
  maxCostIndex: 0,
  loading: true,
  error: null,
};

export default function useTelemetryData(dispositivoId = 'ESP32-001') {
  const [state, setState] = useState(INITIAL);
  const intervalRef = useRef(null);
  const stateRef = useRef(state);

  const refresh = useCallback(async () => {
    try {
      const response = await getTelemetria(dispositivoId, 30);
      const readings = response.data || [];
      if (readings.length === 0) {
        throw new Error('Nenhuma leitura disponível');
      }
      const reversed = [...readings].reverse();
      const latest = reversed[reversed.length - 1];

      const power = buildTimeSeries(reversed, 'potenciaAtiva');
      const voltage = buildTimeSeries(reversed, 'voltagem');
      const current = buildTimeSeries(reversed, 'corrente');
      const daily = buildDailyData(readings, 'consumokWh');
      const financial = buildDailyData(readings, 'custoReais');
      const monthly = +(latest.custoReais * 30).toFixed(2);

      const newState = {
        powerData: power,
        voltageData: voltage,
        currentData: current,
        dailyData: daily,
        financialData: financial,
        voltage: latest.voltagem ?? 0,
        current: latest.corrente ?? 0,
        power: latest.potenciaAtiva ?? 0,
        monthlyCost: monthly,
        frequency: latest.frequencia ?? 0,
        powerFactor: latest.fatorPotencia ?? 0,
        peakPowerIndex: getPeakIndex(power),
        peakVoltageIndex: getPeakIndex(voltage),
        peakCurrentIndex: getPeakIndex(current),
        maxKwhIndex: getPeakIndex(daily),
        maxCostIndex: getPeakIndex(financial),
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
        error: err.message || 'Falha ao conectar com o servidor',
      });
    }
  }, [dispositivoId]);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return state;
}

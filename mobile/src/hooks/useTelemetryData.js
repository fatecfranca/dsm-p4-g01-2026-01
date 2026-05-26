import { useState, useEffect, useCallback, useRef } from 'react';
import { getTelemetria } from '../services/telemetryService';

function randomBetween(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

function generateTimeSeries(generator, count = 30) {
  const now = new Date();
  const data = [];
  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    const h = String(t.getHours()).padStart(2, '0');
    const m = String(t.getMinutes()).padStart(2, '0');
    data.push({ time: `${h}:${m}`, value: generator(i) });
  }
  return data;
}

function generateDailyData(generator) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date().getDay();
  return days.map((_, i) => {
    const idx = (today - 6 + i + 7) % 7;
    return { day: days[idx], value: generator(idx) };
  });
}

function getPeakIndex(data) {
  if (!data || data.length === 0) return 0;
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].value > data[maxIdx].value) maxIdx = i;
  }
  return maxIdx;
}

function getMockFallback() {
  const pf = randomBetween(0.82, 0.99);
  return {
    powerData: generateTimeSeries(() => randomBetween(200, 450)),
    voltageData: generateTimeSeries((i) => {
      const base = 127;
      const variation = Math.sin(i * 0.8) * 4;
      const drop = i % 11 === 0 ? randomBetween(-9, -7) : randomBetween(-2, 2);
      return +(base + variation + drop).toFixed(1);
    }),
    currentData: generateTimeSeries(() => {
      const base = randomBetween(1.5, 2.5);
      const spike = Math.random() > 0.7 ? randomBetween(2, 4) : 0;
      return +(base + spike).toFixed(2);
    }),
    dailyData: generateDailyData(() => randomBetween(8, 30)),
    financialData: generateDailyData(() => randomBetween(8, 22)),
    voltage: randomBetween(125, 129),
    current: randomBetween(1.8, 3.2),
    power: randomBetween(280, 380),
    monthlyCost: randomBetween(75, 95),
    frequency: randomBetween(59.8, 60.2),
    powerFactor: pf,
  };
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
    value: byDay[day] ? +(byDay[day].reduce((a, b) => a + b, 0) / byDay[day].length).toFixed(1) : 0,
  }));
}

export default function useTelemetryData(dispositivoId = 'ESP32-001') {
  const [state, setState] = useState(() => {
    const mock = getMockFallback();
    return {
      ...mock,
      peakPowerIndex: getPeakIndex(mock.powerData),
      peakVoltageIndex: getPeakIndex(mock.voltageData),
      peakCurrentIndex: getPeakIndex(mock.currentData),
      maxKwhIndex: getPeakIndex(mock.dailyData),
      maxCostIndex: getPeakIndex(mock.financialData),
      usingMock: true,
    };
  });

  const intervalRef = useRef(null);
  const stateRef = useRef(state);

  const refresh = useCallback(async () => {
    try {
      const response = await getTelemetria(dispositivoId, 30);
      const readings = response.data || [];
      if (readings.length === 0) {
        throw new Error('Sem dados');
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
        frequency: latest.frequencia ?? 60,
        powerFactor: latest.fatorPotencia ?? 0.95,
        peakPowerIndex: getPeakIndex(power),
        peakVoltageIndex: getPeakIndex(voltage),
        peakCurrentIndex: getPeakIndex(current),
        maxKwhIndex: getPeakIndex(daily),
        maxCostIndex: getPeakIndex(financial),
        usingMock: false,
      };

      stateRef.current = newState;
      setState(newState);
    } catch {
      const prev = stateRef.current;
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const newPoint = { time: `${h}:${m}` };

      setState((prev) => {
        const newPower = [...prev.powerData.slice(1), { ...newPoint, value: randomBetween(200, 450) }];
        const newVoltage = [...prev.voltageData.slice(1), { ...newPoint, value: +(127 + randomBetween(-3, 3)).toFixed(1) }];
        const newCurrent = [...prev.currentData.slice(1), { ...newPoint, value: randomBetween(1.5, 4.5) }];
        return {
          ...prev,
          powerData: newPower,
          voltageData: newVoltage,
          currentData: newCurrent,
          voltage: randomBetween(125, 129),
          current: randomBetween(1.8, 3.2),
          power: randomBetween(280, 380),
          monthlyCost: +(prev.monthlyCost + randomBetween(-1.5, 2.0)).toFixed(2),
          frequency: randomBetween(59.8, 60.2),
          powerFactor: randomBetween(0.82, 0.99),
          peakPowerIndex: getPeakIndex(newPower),
          peakVoltageIndex: getPeakIndex(newVoltage),
          peakCurrentIndex: getPeakIndex(newCurrent),
          usingMock: true,
        };
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

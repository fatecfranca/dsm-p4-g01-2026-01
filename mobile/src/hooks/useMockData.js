import { useState, useEffect, useCallback } from 'react';

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
    data.push({
      time: `${h}:${m}`,
      value: generator(i),
    });
  }
  return data;
}

function generateDailyData(generator) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date().getDay();
  return days.map((_, i) => {
    const idx = (today - 6 + i + 7) % 7;
    return {
      day: days[idx],
      value: generator(idx),
    };
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

function voltageGen(i) {
  const base = 127;
  const variation = Math.sin(i * 0.8) * 4;
  const drop = i % 11 === 0 ? randomBetween(-9, -7) : randomBetween(-2, 2);
  return +(base + variation + drop).toFixed(1);
}

function currentGen() {
  const base = randomBetween(1.5, 2.5);
  const spike = Math.random() > 0.7 ? randomBetween(2, 4) : 0;
  return +(base + spike).toFixed(2);
}

function powerGen() {
  return randomBetween(200, 450);
}

function costGen() {
  return randomBetween(8, 22);
}

function KwhGen() {
  return randomBetween(8, 30);
}

export default function useMockData() {
  const [powerData, setPowerData] = useState(() => generateTimeSeries(powerGen));
  const [voltageData, setVoltageData] = useState(() => generateTimeSeries(voltageGen));
  const [currentData, setCurrentData] = useState(() => generateTimeSeries(currentGen));
  const [dailyData, setDailyData] = useState(() => generateDailyData(KwhGen));
  const [financialData, setFinancialData] = useState(() => generateDailyData(costGen));
  const [voltage, setVoltage] = useState(randomBetween(125, 129));
  const [current, setCurrent] = useState(randomBetween(1.8, 3.2));
  const [power, setPower] = useState(randomBetween(280, 380));
  const [monthlyCost, setMonthlyCost] = useState(randomBetween(75, 95));
  const [frequency, setFrequency] = useState(randomBetween(59.8, 60.2));
  const [powerFactor, setPowerFactor] = useState(randomBetween(0.82, 0.99));

  const refresh = useCallback(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const newPoint = { time: `${h}:${m}` };

    setPowerData((prev) => [...prev.slice(1), { ...newPoint, value: powerGen() }]);
    setVoltageData((prev) => [...prev.slice(1), { ...newPoint, value: voltageGen(0) }]);
    setCurrentData((prev) => [...prev.slice(1), { ...newPoint, value: currentGen() }]);

    setVoltage(randomBetween(125, 129));
    setCurrent(randomBetween(1.8, 3.2));
    setPower(randomBetween(280, 380));
    setFrequency(randomBetween(59.8, 60.2));
    setPowerFactor(randomBetween(0.82, 0.99));

    setMonthlyCost((prev) => +(prev + randomBetween(-1.5, 2.0)).toFixed(2));
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    powerData,
    voltageData,
    currentData,
    dailyData,
    financialData,
    voltage,
    current,
    power,
    monthlyCost,
    frequency,
    powerFactor,
    peakPowerIndex: getPeakIndex(powerData),
    peakVoltageIndex: getPeakIndex(voltageData),
    peakCurrentIndex: getPeakIndex(currentData),
    maxKwhIndex: getPeakIndex(dailyData),
    maxCostIndex: getPeakIndex(financialData),
  };
}

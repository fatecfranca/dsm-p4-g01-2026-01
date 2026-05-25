import { useState, useEffect, useCallback } from 'react';

function randomBetween(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

function generatePowerData() {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    const h = String(t.getHours()).padStart(2, '0');
    const m = String(t.getMinutes()).padStart(2, '0');
    data.push({
      time: `${h}:${m}`,
      watts: randomBetween(200, 450),
    });
  }
  return data;
}

function generateDailyData() {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date().getDay();
  return days.map((_, i) => {
    const idx = (today - 6 + i + 7) % 7;
    return {
      day: days[idx],
      kWh: randomBetween(8, 30),
    };
  });
}

function getPeakIndex(data) {
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].watts > data[maxIdx].watts) maxIdx = i;
  }
  return maxIdx;
}

function getMaxKwhIndex(data) {
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].kWh > data[maxIdx].kWh) maxIdx = i;
  }
  return maxIdx;
}

export default function useMockData() {
  const [powerData, setPowerData] = useState(generatePowerData);
  const [dailyData, setDailyData] = useState(generateDailyData);
  const [voltage, setVoltage] = useState(randomBetween(125, 129));
  const [current, setCurrent] = useState(randomBetween(1.8, 3.2));
  const [power, setPower] = useState(randomBetween(280, 380));
  const [monthlyCost, setMonthlyCost] = useState(randomBetween(75, 95));
  const [frequency, setFrequency] = useState(randomBetween(59.8, 60.2));
  const [powerFactor, setPowerFactor] = useState(randomBetween(0.82, 0.99));

  const refresh = useCallback(() => {
    setPowerData((prev) => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const next = [
        ...prev.slice(1),
        { time: `${h}:${m}`, watts: randomBetween(200, 450) },
      ];
      return next;
    });

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

  const peakIndex = getPeakIndex(powerData);
  const maxKwhIndex = getMaxKwhIndex(dailyData);

  return {
    powerData,
    dailyData,
    voltage,
    current,
    power,
    monthlyCost,
    frequency,
    powerFactor,
    peakIndex,
    maxKwhIndex,
  };
}

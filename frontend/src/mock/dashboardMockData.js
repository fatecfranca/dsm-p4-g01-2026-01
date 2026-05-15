export const currentReadings = {
  voltage: 127.5,
  current: 2.45,
  power: 420.8,
  cost: 89.40,
  frequency: 60.02,
  powerFactor: 0.92,
};

export const powerTimeSeries = [
  { time: '00:00', power: 320 },
  { time: '01:00', power: 280 },
  { time: '02:00', power: 250 },
  { time: '03:00', power: 230 },
  { time: '04:00', power: 260 },
  { time: '05:00', power: 310 },
  { time: '06:00', power: 380 },
  { time: '07:00', power: 450 },
  { time: '08:00', power: 520 },
  { time: '09:00', power: 560 },
  { time: '10:00', power: 590 },
  { time: '11:00', power: 570 },
  { time: '12:00', power: 540 },
  { time: '13:00', power: 530 },
  { time: '14:00', power: 550 },
  { time: '15:00', power: 580 },
  { time: '16:00', power: 600 },
  { time: '17:00', power: 620 },
  { time: '18:00', power: 580 },
  { time: '19:00', power: 520 },
  { time: '20:00', power: 460 },
  { time: '21:00', power: 400 },
  { time: '22:00', power: 360 },
  { time: '23:00', power: 330 },
];

export const dailyConsumption = [
  { day: 'Seg', consumption: 4.2 },
  { day: 'Ter', consumption: 3.8 },
  { day: 'Qua', consumption: 5.1 },
  { day: 'Qui', consumption: 4.5 },
  { day: 'Sex', consumption: 6.2 },
  { day: 'Sáb', consumption: 7.8 },
  { day: 'Dom', consumption: 5.6 },
];

export const systemInfo = {
  status: 'online',
  lastReading: new Date().toLocaleTimeString('pt-BR'),
  uptime: '72h 34m',
  deviceCount: 1,
};

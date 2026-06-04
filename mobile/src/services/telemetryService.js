import api from './api';

const TARIFA_KWH = parseFloat(process.env.EXPO_PUBLIC_TARIFA_KWH) || 0.85;

export async function getTelemetria(dispositivoId = 'ESP32_VENTILADOR', limite = 100) {
  const response = await api.get(`/telemetria/${dispositivoId}`, {
    params: { limite },
  });
  return response.data;
}

export async function getEstatisticas(dispositivoId = 'ESP32_VENTILADOR') {
  const response = await api.get(`/telemetria/estatisticas/${dispositivoId}`);
  return response.data;
}

export function getTarifa() {
  return TARIFA_KWH;
}

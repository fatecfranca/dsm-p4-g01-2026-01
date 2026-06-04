import api from "./api";

const TARIFA_KWH = parseFloat(process.env.EXPO_PUBLIC_TARIFA_KWH) || 0.85;

export async function getTelemetria(
  dispositivoId = "ESP32_VENTILADOR",
  limite = 100,
  dataInicio,
  dataFim,
) {
  const params = { limite };
  if (dataInicio) params.dataInicio = dataInicio;
  if (dataFim) params.dataFim = dataFim;

  const response = await api.get(`/telemetria/${dispositivoId}`, { params });
  return response.data;
}

export async function getEstatisticas(
  dispositivoId = "ESP32_VENTILADOR",
  dataInicio,
  dataFim,
) {
  const params = {};
  if (dataInicio) params.dataInicio = dataInicio;
  if (dataFim) params.dataFim = dataFim;

  const response = await api.get(`/telemetria/estatisticas/${dispositivoId}`, {
    params,
  });
  return response.data;
}

export function getTarifa() {
  return TARIFA_KWH;
}

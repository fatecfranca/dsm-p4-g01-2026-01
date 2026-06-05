import { get } from './api';

const DEFAULT_DEVICE = 'ESP32_VENTILADOR';

export async function fetchTelemetria(
  dispositivoId = DEFAULT_DEVICE,
  limite = 1000,
  start,
  end,
) {
  let endpoint = `/telemetria/${dispositivoId}?limite=${limite}`;
  if (start) endpoint += `&start=${start}`;
  if (end) endpoint += `&end=${end}`;
  return get(endpoint);
}

export async function fetchEstatisticas(dispositivoId = DEFAULT_DEVICE) {
  const endpoint = `/telemetria/estatisticas/${dispositivoId}`;
  return get(endpoint);
}

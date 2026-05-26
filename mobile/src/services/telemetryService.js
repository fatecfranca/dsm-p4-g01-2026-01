import api from './api';

export async function getTelemetria(dispositivoId = 'ESP32-001', limite = 30) {
  const response = await api.get(`/telemetria/${dispositivoId}`, {
    params: { limite },
  });
  return response.data;
}

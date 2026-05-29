import { get } from "./api";

const DEFAULT_DEVICE = "ESP32_SALA_01";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchTelemetria(dispositivoId = DEFAULT_DEVICE, limite = 100) {
  const result = await get(`/telemetria/${dispositivoId}?limite=${limite}`, authHeaders());
  return result.data;
}

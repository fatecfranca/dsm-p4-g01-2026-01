import { get } from "./api";

const DEFAULT_DEVICE = "ESP32_SALA_01";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchTelemetria(dispositivoId = DEFAULT_DEVICE, limite = 1000, start, end) {
  let endpoint = `/telemetria/${dispositivoId}?limite=${limite}`;
  if (start) endpoint += `&start=${start}`;
  if (end) endpoint += `&end=${end}`;
  const result = await get(endpoint, authHeaders());
  return result;
}

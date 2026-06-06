const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const unauthorizedListeners = new Set();

export function onUnauthorized(cb) {
  unauthorizedListeners.add(cb);
  return () => unauthorizedListeners.delete(cb);
}

function emitUnauthorized() {
  unauthorizedListeners.forEach((cb) => {
    try { cb(); } catch { /* ignore */ }
  });
}

function getAuthHeaders() {
  try {
    const token = localStorage.getItem("token");
    if (token) return { Authorization: `Bearer ${token}` };
  } catch { /* ignore */ }
  return {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = new Error(`Erro na requisição: ${response.status}`);
      error.status = response.status;
      try {
        error.data = await response.json();
      } catch {
        error.data = null;
      }
      if (response.status === 401) {
        emitUnauthorized();
      }
      if (import.meta.env.DEV && response.status !== 404) {
        console.error(`Falha ao chamar ${endpoint}:`, error);
      }
      throw error;
    }
    return await response.json();
  } catch (error) {
    if (error.name !== "AbortError" && import.meta.env.DEV) {
      console.error(`Falha ao chamar ${endpoint}:`, error);
    }
    throw error;
  }
}

export function get(endpoint, extraHeaders = {}) {
  return request(endpoint, { method: "GET", headers: extraHeaders });
}

export function post(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function put(endpoint, data) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}

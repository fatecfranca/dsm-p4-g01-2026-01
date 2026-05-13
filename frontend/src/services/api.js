const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Falha ao chamar ${endpoint}:`, error);
    throw error;
  }
}

export function get(endpoint) {
  return request(endpoint, { method: "GET" });
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

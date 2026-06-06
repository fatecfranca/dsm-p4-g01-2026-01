import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_REQUEST_TIMEOUT_MS } from '../constants/config';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://dsm-p4-g01-2026-01.onrender.com/api';

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

async function request(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

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
      if (__DEV__ && response.status !== 404) {
        console.error(`Falha ao chamar ${endpoint}:`, error);
      }
      throw error;
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Tempo limite excedido');
      timeoutError.status = 0;
      throw timeoutError;
    }
    if (error.name !== 'AbortError' && __DEV__) {
      console.error(`Falha ao chamar ${endpoint}:`, error);
    }
    throw error;
  }
}

export function get(endpoint, extraHeaders = {}) {
  return request(endpoint, { method: 'GET', headers: extraHeaders });
}

export function post(endpoint, data) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function put(endpoint, data) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

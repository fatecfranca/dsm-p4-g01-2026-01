import axios from 'axios';

let _token = null;

export function setToken(token) {
  _token = token;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://dsm-p4-g01-2026-01.onrender.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      _token = null;
    }
    return Promise.reject(error);
  }
);

export default api;

import api from './api';

export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha });
  return response.data;
}

export async function cadastro(nome, email, senha) {
  const response = await api.post('/auth/cadastro', { nome, email, senha });
  return response.data;
}

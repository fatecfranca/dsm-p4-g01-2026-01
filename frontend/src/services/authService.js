import { post } from "./api";

export async function login(email, senha) {
  return post("/auth/login", { email, senha });
}

export async function cadastro(nome, email, senha) {
  return post("/auth/cadastro", { nome, email, senha });
}

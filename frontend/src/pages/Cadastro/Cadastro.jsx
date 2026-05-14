import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cadastro } from "../../services/authService";
import styles from "./Cadastro.module.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const data = await cadastro(form.nome, form.email, form.senha);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.cardHeader}>
          <div className={styles.brandIcon}>
            <div className={styles.brandDot} />
            <div className={styles.brandRing} />
          </div>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>
            Preencha os dados para se cadastrar
          </p>
        </div>

        {error && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cad-nome">
              Nome
            </label>
            <input
              id="cad-nome"
              className={styles.input}
              type="text"
              name="nome"
              placeholder="Seu nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cad-email">
              Email
            </label>
            <input
              id="cad-email"
              className={styles.input}
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cad-senha">
              Senha
            </label>
            <input
              id="cad-senha"
              className={styles.input}
              type="password"
              name="senha"
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cad-confirmar">
              Confirmar senha
            </label>
            <input
              id="cad-confirmar"
              className={styles.input}
              type="password"
              name="confirmarSenha"
              placeholder="Repita a senha"
              value={form.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <motion.button
            className={styles.btn}
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </motion.button>
        </form>

        <p className={styles.footer}>
          Já tem conta?{" "}
          <Link to="/login" className={styles.link}>
            Fazer login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../../services/authService";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.senha);
      navigate("/dashboard");
    } catch {
      setError("Email ou senha inválidos.");
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
          <h1 className={styles.title}>Acessar plataforma</h1>
          <p className={styles.subtitle}>Entre com suas credenciais</p>
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
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            <label className={styles.label} htmlFor="login-senha">
              Senha
            </label>
            <input
              id="login-senha"
              className={styles.input}
              type="password"
              name="senha"
              placeholder="••••••••"
              value={form.senha}
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
            {loading ? "Entrando..." : "Entrar"}
          </motion.button>
        </form>

        <p className={styles.footer}>
          Não tem conta?{" "}
          <Link to="/cadastro" className={styles.link}>
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NotFound.module.css";

export default function NotFound() {
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
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.subtitle}>
          A página que você procura não existe ou foi movida.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btn}>
            Voltar ao início
          </Link>
          <Link to="/dashboard" className={styles.btnSecondary}>
            Ir para o Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

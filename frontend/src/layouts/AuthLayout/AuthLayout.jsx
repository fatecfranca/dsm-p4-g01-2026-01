import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoFull from "../../assets/images/logo-full.png";
import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <header className={styles.brandHeader}>
        <Link to="/" className={styles.brandLink} aria-label="EcoSense — voltar para o início">
          <img src={logoFull} alt="EcoSense" className={styles.logo} />
        </Link>
      </header>

      <main className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className={styles.miniFooter}>
        <span>
          &copy; {new Date().getFullYear()} EcoSense &middot; P.I 4&ordm; Semestre
        </span>
        <Link to="/" className={styles.footerLink}>
          Voltar para o site
        </Link>
      </footer>
    </div>
  );
}

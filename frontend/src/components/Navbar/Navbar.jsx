import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import logoFull from "../../assets/images/logo-full.png";
import UserMenu from "./UserMenu";
import styles from "./Navbar.module.css";

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.08, ease: "easeOut" },
  }),
};

const mobileMenu = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard", end: false },
  { to: "/sobre", label: "Sobre", end: false },
  { to: "/iot", label: "IoT", end: false },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand}>
          <img src={logoFull} alt="EcoSense" className={styles.logo} />
        </NavLink>

        <div className={styles.desktopLinks}>
          {links.map((link, i) => (
            <motion.div
              key={link.to}
              custom={i}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {link.label}
                <span className={styles.linkIndicator} />
              </NavLink>
            </motion.div>
          ))}
        </div>

        <div className={styles.desktopRight}>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <div className={styles.desktopAuth}>
                <Link to="/login" className={styles.authLink}>
                  Entrar
                </Link>
                <Link to="/cadastro" className={styles.authLink}>
                  Cadastrar
                </Link>
              </div>

              <motion.div
                className={styles.desktopCta}
                custom={3}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link to="/dashboard" className={styles.cta}>
                  Monitorar Agora
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <button
          className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            variants={mobileMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
          {isAuthenticated ? (
            <>
              <div className={styles.mobileUser}>
                <span className={styles.mobileUserName}>{user.nome}</span>
                <span className={styles.mobileUserEmail}>{user.email}</span>
              </div>
              <div className={styles.mobileDivider} />
              <Link
                to="/"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/sobre"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/iot"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                IoT
              </Link>
              <div className={styles.mobileDivider} />
              <button
                type="button"
                className={styles.mobileLink}
                onClick={() => { setOpen(false); logout(); navigate("/"); }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className={styles.mobileDivider} />

              <Link
                to="/login"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                Cadastrar
              </Link>

              <Link
                to="/dashboard"
                className={styles.mobileCta}
                onClick={() => setOpen(false)}
              >
                Monitorar Agora
              </Link>
            </>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { NavLink } from "react-router-dom";
import logoFull from "../../assets/images/logo-full.png";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand}>
          <img src={logoFull} alt="EcoSense" className={styles.logo} />
        </NavLink>

        <div className={styles.links}>
          <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Dashboard
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Sobre
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

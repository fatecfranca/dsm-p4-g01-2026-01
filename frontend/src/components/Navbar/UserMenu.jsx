import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../theme/colors";
import styles from "./UserMenu.module.css";

function initials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name) {
  const palette = [colors.primary, colors.info, colors.warning, "#8B5CF6", "#EC4899", "#14B8A6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/");
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(o => !o)}>
        <span className={styles.avatar} style={{ background: avatarColor(user.nome) }}>
          {initials(user.nome)}
        </span>
        <span className={styles.name}>{user.nome.split(" ")[0]}</span>
        <svg className={`${styles.chevron} ${open ? styles.chevronUp : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownName}>{user.nome}</span>
              <span className={styles.dropdownEmail}>{user.email}</span>
            </div>
            <div className={styles.dropdownDivider} />
            <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

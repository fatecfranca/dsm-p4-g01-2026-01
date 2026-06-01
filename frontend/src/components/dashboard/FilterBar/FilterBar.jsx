import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FilterBar.module.css";

const MONTHS = [
  "Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];

function toDateInput(iso) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function extractMonths(readings) {
  const set = new Set();
  (readings || []).forEach(r => {
    const d = r.timestamp?.slice(0, 7);
    if (d) set.add(d);
  });
  return [...set].sort();
}

function monthLabel(ym) {
  const [y, m] = ym.split("-");
  return `${MONTHS[parseInt(m)-1]}/${y}`;
}

function fmtRange(start, end) {
  if (!start && !end) return "Todas as leituras";
  const s = start ? start.split("-").reverse().join("/") : "—";
  const e = end ? end.split("-").reverse().join("/") : "—";
  return `${s} – ${e}`;
}

const PRESETS = [
  { key:"all",    label:"Todas" },
  { key:"today",  label:"Hoje" },
  { key:"7d",     label:"7 dias" },
  { key:"30d",    label:"30 dias" },
];

export default function FilterBar({ readings, dateRange, onDateRangeChange }) {
  const months = useMemo(() => extractMonths(readings), [readings]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const today = toDateInput(new Date().toISOString());

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isCustom = dateRange.start || dateRange.end;

  const activeKey = (() => {
    if (!isCustom) return "all";
    const now = new Date();
    const s = toDateInput(now.toISOString());
    if (dateRange.start === s && dateRange.end === s) return "today";
    const d7 = new Date(); d7.setDate(d7.getDate()-7);
    if (dateRange.start === toDateInput(d7.toISOString()) && dateRange.end === s) return "7d";
    const d30 = new Date(); d30.setDate(d30.getDate()-30);
    if (dateRange.start === toDateInput(d30.toISOString()) && dateRange.end === s) return "30d";
    return null;
  })();

  function applyPreset(key) {
    const now = new Date();
    switch (key) {
      case "all":
        onDateRangeChange({ start:"", end:"" }); return;
      case "today":
        const t = toDateInput(now.toISOString());
        onDateRangeChange({ start:t, end:t }); return;
      case "7d": {
        const d7 = new Date(); d7.setDate(d7.getDate()-7);
        onDateRangeChange({ start:toDateInput(d7.toISOString()), end:toDateInput(now.toISOString()) }); return;
      }
      case "30d": {
        const d30 = new Date(); d30.setDate(d30.getDate()-30);
        onDateRangeChange({ start:toDateInput(d30.toISOString()), end:toDateInput(now.toISOString()) }); return;
      }
    }
  }

  return (
    <motion.div
      className={styles.bar}
      initial={{ opacity:0, y:-12 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.3, ease:"easeOut" }}
    >
      {/* Preset pills sempre visiveis */}
      <div className={styles.presets}>
        {PRESETS.map(p => (
          <button
            key={p.key}
            className={`${styles.pill} ${activeKey === p.key ? styles.pillActive : ""}`}
            onClick={() => applyPreset(p.key)}
          >
            {p.label}
          </button>
        ))}

        {/* Seletor de mes custom */}
        {months.length > 0 && (
          <div ref={menuRef} className={styles.monthWrap}>
            <button
              className={`${styles.pill} ${styles.pillChevron} ${menuOpen ? styles.pillOpen : ""}`}
              onClick={() => setMenuOpen(o => !o)}
            >
              Mês
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className={styles.monthMenu}
                  initial={{ opacity:0, y:-6, scaleY:0.95 }}
                  animate={{ opacity:1, y:0, scaleY:1 }}
                  exit={{ opacity:0, y:-6, scaleY:0.95 }}
                  transition={{ duration:0.15 }}
                >
                  {months.map(ym => (
                    <button
                      key={ym}
                      className={styles.monthItem}
                      onClick={() => {
                        const start = `${ym}-01`;
                        const d = new Date(parseInt(ym.split("-")[0]), parseInt(ym.split("-")[1]), 0);
                        const end = toDateInput(d.toISOString());
                        onDateRangeChange({ start, end });
                        setMenuOpen(false);
                      }}
                    >
                      {monthLabel(ym)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Separador e controle de datas custom */}
        {(isCustom || activeKey === null) && <span className={styles.sep} />}
        {isCustom && (
          <span className={styles.tag}>
            {fmtRange(dateRange.start, dateRange.end)}
          </span>
        )}
      </div>

      {/* Inputs de data + botao limpar */}
      <div className={styles.controls}>
        <div className={styles.dateGroup}>
          <label className={styles.dateLabel}>De</label>
          <input
            type="date"
            className={styles.dateInput}
            value={dateRange.start}
            max={dateRange.end || today}
            onChange={e => onDateRangeChange({ ...dateRange, start: e.target.value })}
          />
          <span className={styles.dateDash}>–</span>
          <label className={styles.dateLabel}>Até</label>
          <input
            type="date"
            className={styles.dateInput}
            value={dateRange.end}
            min={dateRange.start || undefined}
            max={today}
            onChange={e => onDateRangeChange({ ...dateRange, end: e.target.value })}
          />
        </div>

        {isCustom && (
          <button
            className={styles.clearBtn}
            onClick={() => onDateRangeChange({ start:"", end:"" })}
            title="Limpar filtro"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

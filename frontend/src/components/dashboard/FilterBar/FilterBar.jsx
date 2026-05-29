import { useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./FilterBar.module.css";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
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
  return `${MONTHS[parseInt(m) - 1]}/${y}`;
}

export default function FilterBar({ readings, dateRange, onDateRangeChange }) {
  const months = useMemo(() => extractMonths(readings), [readings]);

  const today = toDateInput(new Date().toISOString());

  const presets = [
    {
      key: "all",
      label: "Todas",
      action: () => onDateRangeChange({ start: "", end: "" }),
    },
    {
      key: "7d",
      label: "Últ. 7 dias",
      action: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        onDateRangeChange({ start: toDateInput(start.toISOString()), end: toDateInput(end.toISOString()) });
      },
    },
    {
      key: "30d",
      label: "Últ. 30 dias",
      action: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        onDateRangeChange({ start: toDateInput(start.toISOString()), end: toDateInput(end.toISOString()) });
      },
    },
    ...(months.length > 0
      ? [
          {
            key: "month",
            label: "Por mês",
            isDropdown: true,
            options: months.map(ym => ({
              label: monthLabel(ym),
              action: () => {
                const start = `${ym}-01`;
                const d = new Date(parseInt(ym.split("-")[0]), parseInt(ym.split("-")[1]), 0);
                const end = toDateInput(d.toISOString());
                onDateRangeChange({ start, end });
              },
            })),
          },
        ]
      : []),
  ];

  const isAll = !dateRange.start && !dateRange.end;
  const activePreset = isAll ? "all" : null;

  return (
    <motion.div
      className={styles.bar}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={styles.presets}>
        {presets.map(p => (
          p.isDropdown ? (
            <details key={p.key} className={styles.dropdown}>
              <summary className={`${styles.pill} ${styles.pillDropdown}`}>
                {p.label}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className={styles.dropdownMenu}>
                {p.options.map((opt, i) => (
                  <button key={i} className={styles.dropdownItem} onClick={opt.action}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </details>
          ) : (
            <button
              key={p.key}
              className={`${styles.pill} ${activePreset === p.key ? styles.pillActive : ""}`}
              onClick={p.action}
            >
              {p.label}
            </button>
          )
        ))}
      </div>

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

      </div>
    </motion.div>
  );
}

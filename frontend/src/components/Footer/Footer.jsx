import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span className={styles.text}>
          P.I 4&ordm; Semestre &mdash; EcoSense &mdash; Monitoramento inteligente para um futuro sustentável
        </span>
      </div>
    </footer>
  );
}

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>
      <p className={styles.placeholder}>
        O monitoramento em tempo real será exibido aqui.
      </p>
    </section>
  );
}

import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>EcoSense</h1>
      <p className={styles.subtitle}>
        Monitoramento inteligente para um futuro sustentável
      </p>
      <div className={styles.card}>
        <p>
          Sistema IoT que coleta dados de corrente e voltagem diretamente dos
          equipamentos, permitindo acompanhar o consumo de energia, identificar
          desperdícios e tomar decisões mais eficientes.
        </p>
      </div>
    </main>
  );
}

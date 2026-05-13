import styles from "./Sobre.module.css";

export default function Sobre() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Sobre o EcoSense</h2>
      <p className={styles.text}>
        O EcoSense é um sistema IoT desenvolvido para monitorar a eficiência
        energética de equipamentos eletrônicos em tempo real. Utiliza sensores
        de corrente e voltagem conectados a um ESP32, enviando dados para uma
        API que processa consumo, potência e gasto.
      </p>
    </section>
  );
}

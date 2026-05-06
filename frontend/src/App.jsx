import { colors } from "./theme/colors";
import styles from "./styles/app.module.css";
import logo from "./assets/images/logo-full.png";

export default function App() {
  return (
    <main className={styles.container}>
      <img src={logo} alt="EcoSense Logo" className={styles.logo} />
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
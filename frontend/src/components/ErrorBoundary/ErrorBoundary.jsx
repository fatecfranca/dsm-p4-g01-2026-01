import { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./ErrorBoundary.module.css";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary capturou:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.page}>
          <div className={styles.bgGlow} />
          <div className={styles.card}>
            <span className={styles.code}>Erro</span>
            <h1 className={styles.title}>Algo deu errado</h1>
            <p className={styles.subtitle}>
              A aplicação encontrou um erro inesperado. Você pode tentar recarregar a página ou voltar para a tela inicial.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className={styles.details}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            )}
            <div className={styles.actions}>
              <button className={styles.btn} onClick={this.handleReset}>
                Tentar novamente
              </button>
              <Link to="/" className={styles.btnSecondary}>
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

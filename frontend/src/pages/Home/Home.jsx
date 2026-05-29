import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroContent}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.span className={styles.heroTag} variants={fadeUp}>
              Plataforma IoT de Monitoramento
            </motion.span>
            <motion.h1 className={styles.heroTitle} variants={fadeUp}>
              Economia de energia em{" "}
              <span className={styles.heroGradient}>tempo real</span>
            </motion.h1>
            <motion.p className={styles.heroSubtitle} variants={fadeUp}>
              Acompanhe o consumo de energia dos seus equipamentos com sensores
              IoT. Receba alertas inteligentes, analise dados precisos e reduza
              desperdícios.
            </motion.p>
            <motion.div className={styles.heroButtons} variants={fadeUp}>
              <Link to="/dashboard" className={styles.btnPrimary}>
                Explorar Dashboard
              </Link>
              <Link to="/sobre" className={styles.btnSecondary}>
                Saiba Mais
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className={styles.visualPanel}>
              <div className={styles.visualGrid} />
              <div className={styles.visualGlow} />

              <div className={styles.visualBars}>
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "60%" }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "85%" }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "45%" }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "70%" }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "90%" }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "55%" }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "75%" }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                />
                <motion.div
                  className={styles.visualBar}
                  initial={{ height: 0 }}
                  animate={{ height: "40%" }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                />
              </div>

              <div className={styles.visualNode} style={{ top: "20%", left: "12%" }} />
              <div className={styles.visualNode} style={{ top: "65%", left: "78%" }} />
              <div className={styles.visualNode} style={{ top: "78%", left: "25%" }} />
              <div className={styles.visualNode} style={{ top: "25%", left: "82%" }} />

              <svg className={styles.visualLines} viewBox="0 0 400 300" preserveAspectRatio="none">
                <line x1="48" y1="60" x2="312" y2="195" stroke="rgba(34,197,94,0.15)" strokeWidth="1.5" />
                <line x1="312" y1="195" x2="100" y2="234" stroke="rgba(59,130,246,0.15)" strokeWidth="1.5" />
                <line x1="100" y1="234" x2="328" y2="75" stroke="rgba(34,197,94,0.1)" strokeWidth="1.5" />
              </svg>

              <div className={styles.visualPulse} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.destaques}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Por que EcoSense?
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Uma plataforma completa para transformar dados energéticos em
            decisões inteligentes
          </motion.p>

          <motion.div
            className={styles.destaquesGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div className={styles.destaqueCard} variants={fadeUp}>
              <div className={styles.cardIcon}>
                <div className={styles.iconDot} />
                <div className={styles.iconPulse} />
              </div>
              <h3 className={styles.cardTitle}>Monitoramento em Tempo Real</h3>
              <p className={styles.cardText}>
                Dados atualizados instantaneamente dos seus equipamentos via
                sensores IoT.
              </p>
            </motion.div>

            <motion.div className={styles.destaqueCard} variants={fadeUp}>
              <div className={styles.cardIcon}>
                <div className={styles.iconBarSm} style={{ height: "55%" }} />
                <div className={styles.iconBarSm} style={{ height: "85%" }} />
                <div className={styles.iconBarSm} style={{ height: "40%" }} />
              </div>
              <h3 className={styles.cardTitle}>Análise de Consumo</h3>
              <p className={styles.cardText}>
                Gráficos e relatórios detalhados para entender padrões de uso e
                economia.
              </p>
            </motion.div>

            <motion.div className={styles.destaqueCard} variants={fadeUp}>
              <div className={styles.cardIcon}>
                <div className={styles.iconAlert} />
                <span className={styles.iconExclamation}>!</span>
              </div>
              <h3 className={styles.cardTitle}>Alertas Inteligentes</h3>
              <p className={styles.cardText}>
                Notificações automáticas para consumo anormal, picos de energia
                e falhas.
              </p>
            </motion.div>

            <motion.div className={styles.destaqueCard} variants={fadeUp}>
              <div className={styles.cardIcon}>
                <div className={styles.iconLeaf} />
                <div className={styles.iconLeafInner} />
              </div>
              <h3 className={styles.cardTitle}>Economia de Energia</h3>
              <p className={styles.cardText}>
                Recomendações personalizadas para otimizar o consumo e reduzir
                custos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={styles.mockup}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Visualize seus dados
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dashboard completo com todas as informações que você precisa
          </motion.p>

          <motion.div
            className={styles.mockupFrame}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className={styles.mockupHeader}>
              <div className={styles.mockupDots}>
                <span className={styles.mockupDotRed} />
                <span className={styles.mockupDotYellow} />
                <span className={styles.mockupDotGreen} />
              </div>
              <span className={styles.mockupLabel}>EcoSense — Dashboard</span>
            </div>

            <div className={styles.mockupBody}>
              <div className={styles.mockupStats}>
                <div className={styles.mockupStat}>
                  <span className={styles.statLabel}>Consumo Atual</span>
                  <span className={styles.statValue}>
                    2.4<span className={styles.statUnit}>kW</span>
                  </span>
                  <span className={styles.statBadge} data-trend="down">
                    ▼ 12%
                  </span>
                </div>
                <div className={styles.mockupStat}>
                  <span className={styles.statLabel}>Economia Hoje</span>
                  <span className={styles.statValue}>
                    R$ 3,80
                  </span>
                  <span className={styles.statBadge} data-trend="up">
                    ▲ economia
                  </span>
                </div>
                <div className={styles.mockupStat}>
                  <span className={styles.statLabel}>Dispositivos</span>
                  <span className={styles.statValue}>8</span>
                  <span className={styles.statBadge} data-trend="info">
                    ● online
                  </span>
                </div>
                <div className={styles.mockupStat}>
                  <span className={styles.statLabel}>Alertas Hoje</span>
                  <span className={styles.statValue}>2</span>
                  <span className={styles.statBadge} data-trend="warn">
                    ⚠ 1 pendente
                  </span>
                </div>
              </div>

              <div className={styles.mockupChart}>
                <div className={styles.mockupChartArea}>
                  <div className={styles.chartGrid} />
                  <svg
                    className={styles.chartSvg}
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,85 C20,75 40,65 60,70 C80,75 100,35 130,45 C160,55 180,20 210,30 C240,40 260,15 280,20 C290,22 295,12 300,15"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,85 C20,75 40,65 60,70 C80,75 100,35 130,45 C160,55 180,20 210,30 C240,40 260,15 280,20 C290,22 295,12 300,15 L300,100 L0,100 Z"
                      fill="url(#chartGrad)"
                    />
                  </svg>
                </div>
              </div>

              <div className={styles.mockupDevices}>
                <div className={styles.deviceRow}>
                  <span className={styles.deviceName}>Geladeira</span>
                  <div className={styles.deviceBarBg}>
                    <div
                      className={styles.deviceBarFill}
                      style={{ width: "65%" }}
                    />
                  </div>
                  <span className={styles.deviceValue}>450W</span>
                </div>
                <div className={styles.deviceRow}>
                  <span className={styles.deviceName}>Micro-ondas</span>
                  <div className={styles.deviceBarBg}>
                    <div
                      className={styles.deviceBarFill}
                      style={{ width: "35%", background: "var(--color-warning)" }}
                    />
                  </div>
                  <span className={styles.deviceValue}>120W</span>
                </div>
                <div className={styles.deviceRow}>
                  <span className={styles.deviceName}>Ventilador</span>
                  <div className={styles.deviceBarBg}>
                    <div
                      className={styles.deviceBarFill}
                      style={{ width: "20%", background: "var(--color-info)" }}
                    />
                  </div>
                  <span className={styles.deviceValue}>75W</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

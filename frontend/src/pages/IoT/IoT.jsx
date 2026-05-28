import { motion } from "framer-motion";
import styles from "./IoT.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const components = [
  {
    name: "ESP32 NodeMCU",
    type: "Microcontrolador",
    spec: "Wi-Fi + Bluetooth, 240MHz, 4MB Flash",
    desc: "Cérebro do sistema. Executa o firmware, lê os sensores e envia os dados para a API via Wi-Fi.",
    color: "var(--color-primary)",
  },
  {
    name: "ACS712 20A",
    type: "Sensor de Corrente AC/DC",
    spec: "20A, saída analógica 0-5V",
    desc: "Mede a corrente elétrica que passa pelo circuito monitorado. Suporta corrente alternada e contínua.",
    color: "var(--color-secondary)",
  },
  {
    name: "ZMPT101B",
    type: "Sensor de Tensão AC",
    spec: "0-250V, saída analógica 0-5V",
    desc: "Mede a tensão da rede elétrica. Essencial para calcular potência e fator de potência.",
    color: "var(--color-info)",
  },
  {
    name: "Jumpers M-F / M-M",
    type: "Cabos de Conexão",
    spec: "Kit 40 fios, 20cm",
    desc: "Conectam os sensores ao ESP32 sem necessidade de solda. Práticos para prototipagem.",
    color: "var(--color-warning)",
  },
  {
    name: "Cabo Micro USB",
    type: "Fonte de Alimentação",
    spec: "5V / 1A",
    desc: "Alimenta o ESP32 e os sensores. Pode ser conectado a um carregador ou power bank.",
    color: "var(--color-danger)",
  },
];

function ComponentCard({ c }) {
  return (
    <motion.div className={styles.card} variants={fadeUp} style={{ "--accent": c.color }}>
      <div className={styles.cardIcon} style={{ background: `${c.color}15` }}>
        <div className={styles.cardDot} style={{ background: c.color }} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardType}>{c.type}</span>
        <h3 className={styles.cardName}>{c.name}</h3>
        <span className={styles.cardSpec} style={{ color: c.color }}>{c.spec}</span>
        <p className={styles.cardDesc}>{c.desc}</p>
      </div>
    </motion.div>
  );
}

export default function IoT() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGrid} />
          <div className={styles.heroGlow} />
        </div>
        <motion.div
          className={styles.heroInner}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.span className={styles.heroTag} variants={fadeUp}>Hardware Livre</motion.span>
          <motion.h1 className={styles.heroTitle} variants={fadeUp}>
            Arquitetura{" "}
            <span className={styles.heroGradient}>IoT</span>
          </motion.h1>
          <motion.p className={styles.heroSub} variants={fadeUp}>
            Conheça os componentes físicos do projeto e como eles trabalham
            juntos para monitorar o consumo de energia em tempo real.
          </motion.p>
        </motion.div>
      </section>

      <section className={styles.about}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Como funciona
          </motion.h2>
          <motion.p
            className={styles.aboutText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            O ESP32 NodeMCU lê os sensores de corrente (ACS712 20A) e
            tensão (ZMPT101B), processa os sinais analógicos e envia os dados
            via HTTP (POST) no formato JSON para a API. Do outro lado, o
            Dashboard exibe tudo em gráficos claros e objetivos.
          </motion.p>
          <motion.p
            className={styles.aboutText}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Os sensores são conectados ao ESP32 por cabos jumper — sem solda, sem
            complicação. Uma fonte micro USB de 5V alimenta o conjunto, que funciona
            de forma autônoma. Opcionalmente, um display LCD 16x2 com I2C pode ser
            adicionado à protoboard para exibir o consumo em tempo real no local.
          </motion.p>
        </div>
      </section>

      <section className={styles.components}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Componentes
          </motion.h2>
          <motion.p
            className={styles.sectionSub}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Lista completa de peças utilizadas no protótipo
          </motion.p>

          <motion.div
            className={styles.grid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {components.map((c) => (
              <ComponentCard key={c.name} c={c} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

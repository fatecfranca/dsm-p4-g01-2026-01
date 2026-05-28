import { motion } from "framer-motion";
import styles from "./IoT.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { transition: { duration: 0.6, ease: "easeOut" } },
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
    function: "Cérebro do sistema. Lê os sensores e envia os dados para a API via Wi-Fi.",
    color: "var(--color-primary)",
  },
  {
    name: "ACS712 20A",
    type: "Sensor de Corrente",
    spec: "AC/DC, 20A, saída analógica 0-5V",
    function: "Mede a corrente elétrica do circuito monitorado. Suporta corrente alternada e contínua.",
    color: "var(--color-secondary)",
  },
  {
    name: "ZMPT101B",
    type: "Sensor de Tensão",
    spec: "AC, 0-250V, saída analógica 0-5V",
    function: "Mede a tensão da rede elétrica. Permite calcular potência aparente e fator de potência.",
    color: "var(--color-info)",
  },
  {
    name: "Jumpers M-F / M-M",
    type: "Cabos de Conexão",
    spec: "Kit 40 fios, 20cm",
    function: "Conectam os sensores ao ESP32 sem necessidade de solda.",
    color: "var(--color-warning)",
  },
  {
    name: "Cabo Micro USB",
    type: "Fonte de Alimentação",
    spec: "5V / 1A",
    function: "Alimenta o ESP32 e os sensores. Pode ser conectado a um carregador de celular ou power bank.",
    color: "var(--color-danger)",
  },
];

const pinout = [
  { component: "ACS712", pin: "VCC", esp: "5V", note: "Alimentação do sensor" },
  { component: "ACS712", pin: "GND", esp: "GND", note: "Terra comum" },
  { component: "ACS712", pin: "OUT", esp: "GPIO34", note: "Leitura analógica da corrente" },
  { component: "ZMPT101B", pin: "VCC", esp: "5V", note: "Alimentação do sensor" },
  { component: "ZMPT101B", pin: "GND", esp: "GND", note: "Terra comum" },
  { component: "ZMPT101B", pin: "OUT", esp: "GPIO35", note: "Leitura analógica da tensão" },
];

function ComponentCard({ c, index }) {
  return (
    <motion.div
      className={styles.compCard}
      variants={fadeUp}
      style={{ "--accent": c.color }}
    >
      <div className={styles.compVisual}>
        <div className={styles.compIcon} style={{ background: `${c.color}15` }}>
          <div className={styles.compDot} style={{ background: c.color }} />
        </div>
        <span className={styles.compType}>{c.type}</span>
      </div>
      <div className={styles.compBody}>
        <h3 className={styles.compName}>{c.name}</h3>
        <p className={styles.compSpec}>{c.spec}</p>
        <p className={styles.compFunc}>{c.function}</p>
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
          <motion.span className={styles.heroTag} variants={fadeUp}>
            Hardware Livre
          </motion.span>
          <motion.h1 className={styles.heroTitle} variants={fadeUp}>
            Arquitetura{" "}
            <span className={styles.heroGradient}>IoT</span>
          </motion.h1>
          <motion.p className={styles.heroSub} variants={fadeUp}>
            Conheça os componentes físicos que transformam sua casa em um
            ambiente inteligente e monitorado.
          </motion.p>
        </motion.div>
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
            className={styles.compGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {components.map((c, i) => (
              <ComponentCard key={c.name} c={c} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.diagram}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Diagrama de Ligação
          </motion.h2>
          <motion.p
            className={styles.sectionSub}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Esquema de conexão entre os componentes e o ESP32
          </motion.p>

          <motion.div
            className={styles.diagramVisual}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.diagramBoard}>
              <div className={styles.boardLabel}>ESP32 NodeMCU</div>
              <div className={styles.boardChip}>
                <div className={styles.chipText}>ESP32</div>
              </div>
              <div className={styles.pinRow}>
                <div className={styles.pin} style={{ "--pin-color": "var(--color-secondary)" }}>
                  <span className={styles.pinLabel}>GPIO34</span>
                  <span className={styles.pinDot} />
                </div>
                <div className={styles.pin} style={{ "--pin-color": "var(--color-info)" }}>
                  <span className={styles.pinLabel}>GPIO35</span>
                  <span className={styles.pinDot} />
                </div>
                <div className={styles.pin} style={{ "--pin-color": "var(--color-danger)" }}>
                  <span className={styles.pinLabel}>5V</span>
                  <span className={styles.pinDot} />
                </div>
                <div className={styles.pin} style={{ "--pin-color": "var(--color-text-secondary)" }}>
                  <span className={styles.pinLabel}>GND</span>
                  <span className={styles.pinDot} />
                </div>
              </div>
              <svg className={styles.diagramArrows} viewBox="0 0 400 200">
                <line x1="120" y1="120" x2="250" y2="70" stroke="var(--color-secondary)" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="120" y1="140" x2="250" y2="100" stroke="var(--color-info)" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="120" y1="160" x2="250" y2="130" stroke="var(--color-danger)" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="120" y1="180" x2="250" y2="170" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" />
              </svg>
              <div className={styles.diagramSensors}>
                <div className={styles.sensorCard} style={{ "--s-color": "var(--color-secondary)" }}>
                  <div className={styles.sensorName}>ACS712</div>
                  <div className={styles.sensorPins}>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-danger)" }}>VCC</span>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-text-secondary)" }}>GND</span>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-secondary)" }}>OUT</span>
                  </div>
                </div>
                <div className={styles.sensorCard} style={{ "--s-color": "var(--color-info)" }}>
                  <div className={styles.sensorName}>ZMPT101B</div>
                  <div className={styles.sensorPins}>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-danger)" }}>VCC</span>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-text-secondary)" }}>GND</span>
                    <span className={styles.sensorPin} style={{ borderColor: "var(--color-info)" }}>OUT</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.diagramLegend}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ borderColor: "var(--color-secondary)" }} />
              <span>ACS712 → GPIO34</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ borderColor: "var(--color-info)" }} />
              <span>ZMPT101B → GPIO35</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ borderColor: "var(--color-danger)" }} />
              <span>5V (alimentação)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLine} style={{ borderColor: "var(--color-text-secondary)" }} />
              <span>GND (terra comum)</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.pinout}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Pinagem
          </motion.h2>
          <motion.p
            className={styles.sectionSub}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Mapeamento completo dos pinos do ESP32 para cada sensor
          </motion.p>

          <motion.div
            className={styles.tableWrapper}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>Pino</th>
                  <th>ESP32</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {pinout.map((row, i) => (
                  <tr key={i}>
                    <td className={styles.compCell}>
                      <span
                        className={styles.compBullet}
                        style={{
                          background: row.component === "ACS712" ? "var(--color-secondary)" : "var(--color-info)",
                        }}
                      />
                      {row.component}
                    </td>
                    <td>
                      <code className={styles.pinCode}>{row.pin}</code>
                    </td>
                    <td>
                      <code className={styles.pinCode}>{row.esp}</code>
                    </td>
                    <td className={styles.noteCell}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </>
  );
}

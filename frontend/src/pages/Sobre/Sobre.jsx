import { motion } from "framer-motion";
import styles from "./Sobre.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const members = [
  {
    initials: "IR",
    name: "Iago Rodrigues Pinheiro",
    role: "Desenvolvedor Front-End e Mobile",
    color: "var(--color-primary)",
  },
  {
    initials: "PC",
    name: "Pedro Henrique Xavier Constancio",
    role: "Desenvolvedor Back-end / IoT",
    color: "var(--color-secondary)",
  },
  {
    initials: "KR",
    name: "Kaio Leandro Rissato",
    role: "Desenvolvedor Mobile / IoT",
    color: "var(--color-info)",
  },
];

const techs = [
  { name: "React", desc: "Interface moderna e reativa", color: "var(--color-info)" },
  { name: "Node.js", desc: "API robusta e escalável", color: "var(--color-success)" },
  { name: "MongoDB", desc: "Banco de dados flexível", color: "var(--color-success)" },
  { name: "ESP32", desc: "Microcontrolador IoT", color: "var(--color-secondary)" },
  { name: "IoT", desc: "Sensores de corrente e tensão", color: "var(--color-warning)" },
  { name: "Recharts", desc: "Gráficos dinâmicos e interativos", color: "var(--color-primary)" },
];

function MemberCard({ member, index }) {
  return (
    <motion.div
      className={styles.memberCard}
      variants={fadeUp}
      whileHover="hover"
    >
      <motion.div
        className={styles.memberAvatar}
        style={{ "--glow": member.color }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3, type: "spring" }}
      >
        <span className={styles.memberInitials}>{member.initials}</span>
        <div className={styles.avatarGlow} style={{ background: member.color }} />
      </motion.div>
      <h3 className={styles.memberName}>{member.name}</h3>
      <span className={styles.memberRole} style={{ color: member.color }}>
        {member.role}
      </span>
      <div className={styles.memberSocial}>
        <span className={styles.socialDot} style={{ background: member.color }} />
        <span className={styles.socialDot} style={{ background: member.color }} />
        <span className={styles.socialDot} style={{ background: member.color }} />
      </div>
    </motion.div>
  );
}

export default function Sobre() {
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
              Sobre o Projeto
            </motion.span>
            <motion.h1 className={styles.heroTitle} variants={fadeUp}>
              Transformando dados em{" "}
              <span className={styles.heroGradient}>energia inteligente</span>
            </motion.h1>
            <motion.p className={styles.heroSubtitle} variants={fadeUp}>
              O EcoSense nasceu para resolver um desafio real: monitorar o
              consumo de energia de forma acessível, precisa e em tempo real
              usando tecnologia IoT.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className={styles.visualPanel}>
              <div className={styles.visualGrid} />
              <div className={styles.visualGlowGreen} />

              <div className={styles.visualNodes}>
                <motion.div
                  className={styles.netNode}
                  style={{ top: "25%", left: "20%" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className={styles.netNode}
                  style={{ top: "60%", left: "75%", background: "var(--color-secondary)", boxShadow: "0 0 14px rgba(59,130,246,0.5)" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div
                  className={styles.netNode}
                  style={{ top: "75%", left: "30%", background: "var(--color-info)", boxShadow: "0 0 14px rgba(6,182,212,0.5)" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                  className={styles.netNode}
                  style={{ top: "30%", left: "80%", background: "var(--color-warning)", boxShadow: "0 0 14px rgba(245,158,11,0.5)" }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.div
                  className={styles.netNode}
                  style={{ top: "50%", left: "50%", width: 10, height: 10, background: "var(--color-primary)", boxShadow: "0 0 20px rgba(34,197,94,0.6)" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <svg className={styles.netLines} viewBox="0 0 400 300" preserveAspectRatio="none">
                <line x1="80" y1="75" x2="200" y2="150" stroke="rgba(34,197,94,0.15)" strokeWidth="1.5" />
                <line x1="200" y1="150" x2="300" y2="180" stroke="rgba(59,130,246,0.15)" strokeWidth="1.5" />
                <line x1="300" y1="180" x2="120" y2="225" stroke="rgba(6,182,212,0.15)" strokeWidth="1.5" />
                <line x1="120" y1="225" x2="320" y2="90" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" />
                <line x1="200" y1="150" x2="320" y2="90" stroke="rgba(34,197,94,0.1)" strokeWidth="1" />
                <line x1="80" y1="75" x2="200" y2="150" stroke="rgba(34,197,94,0.1)" strokeWidth="1" />
                <line x1="200" y1="150" x2="120" y2="225" stroke="rgba(34,197,94,0.1)" strokeWidth="1" />
              </svg>

              <div className={styles.visualBadge}>
                <span className={styles.badgeDot} />
                <span className={styles.badgeText}>IoT CONECTADO</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.projeto}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Sobre o Projeto
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Uma solução completa de monitoramento energético construída do zero
            com hardware e software modernos
          </motion.p>

          <motion.div
            className={styles.projetoGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div className={styles.projetoCard} variants={fadeUp}>
              <div className={styles.projIcon} style={{ background: "rgba(34,197,94,0.08)" }}>
                <div className={styles.projIconInner}>
                  <div className={styles.projPulse} />
                </div>
              </div>
              <h3 className={styles.cardTitle}>Propósito</h3>
              <p className={styles.cardText}>
                Democratizar o acesso ao monitoramento energético, permitindo que
                qualquer pessoa acompanhe e reduza seu consumo de forma inteligente.
              </p>
            </motion.div>

            <motion.div className={styles.projetoCard} variants={fadeUp}>
              <div className={styles.projIcon} style={{ background: "rgba(59,130,246,0.08)" }}>
                <div className={styles.projIconInner}>
                  <span className={styles.projIconText}>IoT</span>
                </div>
              </div>
              <h3 className={styles.cardTitle}>Tecnologia IoT</h3>
              <p className={styles.cardText}>
                Sensores de corrente ACS712 20A e voltagem ZMPT101B conectados a um
                ESP32 enviam dados em tempo real para processamento.
              </p>
            </motion.div>

            <motion.div className={styles.projetoCard} variants={fadeUp}>
              <div className={styles.projIcon} style={{ background: "rgba(6,182,212,0.08)" }}>
                <div className={styles.projIconInner}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.cardTitle}>Dados Precisos</h3>
              <p className={styles.cardText}>
                Cálculos de potência, consumo e gasto processados por uma API
                Node.js e armazenados no MongoDB para análise histórica.
              </p>
            </motion.div>

            <motion.div className={styles.projetoCard} variants={fadeUp}>
              <div className={styles.projIcon} style={{ background: "rgba(245,158,11,0.08)" }}>
                <div className={styles.projIconInner}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.cardTitle}>Visualização</h3>
              <p className={styles.cardText}>
                Dashboard interativo com gráficos, relatórios e alertas visuais
                para tomada de decisão rápida e eficiente.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={styles.tech}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Tecnologias
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stack moderna e escalável utilizada no desenvolvimento do EcoSense
          </motion.p>

          <motion.div
            className={styles.techGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {techs.map((tech) => (
              <motion.div
                key={tech.name}
                className={styles.techCard}
                variants={fadeUp}
                whileHover="hover"
                style={{ "--accent": tech.color }}
              >
                <div className={styles.techIcon}>
                  <span className={styles.techIconText}>{tech.name.slice(0, 2)}</span>
                </div>
                <h3 className={styles.techName}>{tech.name}</h3>
                <p className={styles.techDesc}>{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.equipe}>
        <div className={styles.sectionInner}>
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Equipe
          </motion.h2>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Conheça o time por trás do EcoSense
          </motion.p>

          <motion.div
            className={styles.equipeGrid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {members.map((member, index) => (
              <MemberCard key={member.name} member={member} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

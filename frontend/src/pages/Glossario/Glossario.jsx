import { motion } from "framer-motion";
import styles from "./Glossario.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const Icones = {
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" /></svg>,
  trend: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V4" /><path d="M12 20V10" /><path d="M6 20v-4" /></svg>,
  pulse: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  speed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14v-4" /><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>,
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  server: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  power: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>,
  line: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>,
  pie: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>,
  range: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  box: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>,
};

const SECOES = [
  {
    id: "kpis",
    titulo: "KPIs do Dashboard",
    resumo: "Os 5 cartões que aparecem no topo da tela.",
    itens: [
      {
        icone: "dollar",
        nome: "Custo Real",
        cor: "var(--color-danger)",
        resumo: "Quanto você já gastou em Reais desde o início do período.",
        detalhes: [
          "Calculado a partir da energia consumida (em kWh) multiplicada pela tarifa de R$ 0,85/kWh.",
          "Abaixo do valor em R$, mostramos o Consumo Acumulado em kWh — a grandeza física que independe da tarifa. Assim, se a bandeira tarifária mudar (vermelha, escassez hídrica), o kWh não muda.",
          "Útil para comparar com a conta de luz da concessionária.",
        ],
      },
      {
        icone: "trend",
        nome: "Previsão Mensal",
        cor: "var(--color-warning)",
        resumo: "Estimativa do gasto total no fim do mês, considerando o ritmo atual.",
        detalhes: [
          "Calculada com base na média de consumo até agora e nos dias restantes do mês.",
          "O selo ao lado indica a tendência: Aumentando (consumo subindo), Estável ou Diminuindo.",
          "Se a tendência for crescente, vale revisar hábitos ou equipamentos em standby.",
        ],
      },
      {
        icone: "pulse",
        nome: "Fator de Potência",
        cor: "#8B5CF6",
        resumo: "O 'Santo Graal' da eficiência elétrica — vai de 0 a 1.",
        detalhes: [
          "Mede o quanto da energia que chega da rede é realmente convertida em trabalho útil (luz, rotação, calor).",
          "No Brasil, a concessionária cobra multa se o fator de potência ficar abaixo de 0,92 — referência legal da ANEEL.",
          "Acima de 0,92: selo verde 'Eficiente'. Abaixo: selo vermelho 'Atenção' (passível de multa em instalações industriais).",
          "Para residências, é mais difícil de controlar — depende mais dos equipamentos do que do usuário.",
        ],
      },
      {
        icone: "speed",
        nome: "Frequência da Rede (Hz)",
        cor: "var(--color-info)",
        resumo: "Quantos ciclos por segundo a rede elétrica está entregando.",
        detalhes: [
          "No Brasil, o padrão é 60 Hz, cravado. Oscilações severas (abaixo de 59,5 Hz ou acima de 60,5 Hz) podem queimar motores de geladeiras, freezers e compressores.",
          "Mostramos a média do período e um selo 'Estável' ou 'Instável'.",
          "Se aparecer 'Instável', vale acionar a concessionária — pode ser um problema na rede da sua região.",
        ],
      },
      {
        icone: "zap",
        nome: "Qualidade da Tensão",
        cor: "var(--color-primary)",
        resumo: "Estatísticas da voltagem que chega no aparelho (V).",
        detalhes: [
          "Média, Mediana, Moda e Desvio Padrão — todas em Volts.",
          "O ideal residencial no Brasil é 127 V ou 220 V, com pouca variação.",
          "Se o desvio padrão for maior que 5% da média, o valor fica vermelho — sinal de tensão instável (pode danificar equipamentos sensíveis).",
        ],
      },
    ],
  },
  {
    id: "status",
    titulo: "Status em Tempo Real",
    resumo: "Os indicadores do topo direito do Dashboard.",
    itens: [
      {
        icone: "server",
        nome: "Sistema Online / Offline",
        cor: "var(--color-success)",
        resumo: "Se o nosso servidor está conseguindo ler dados do sensor.",
        detalhes: [
          "Verde: dados chegando normalmente.",
          "Vermelho: servidor não consegue alcançar o sensor — pode ser queda de internet, sensor desligado ou manutenção.",
        ],
      },
      {
        icone: "power",
        nome: "Aparelho Ligado / Desligado",
        cor: "var(--color-success)",
        resumo: "Bolinha que mostra se o seu equipamento está consumindo energia agora.",
        detalhes: [
          "Verde com valor em kW: aparelho LIGADO — está puxando energia da rede.",
          "Cinza: aparelho DESLIGADO ou em standby (0 W).",
          "Vermelho: 'Leitura Inválida' — o sensor enviou um valor negativo, indicando falha de calibração ou ruído elétrico.",
        ],
      },
    ],
  },
  {
    id: "graficos",
    titulo: "Gráficos e Curvas",
    resumo: "O que cada visualização está mostrando.",
    itens: [
      {
        icone: "line",
        nome: "Linha do Tempo",
        cor: "var(--color-primary)",
        resumo: "Potência (kW) e Tensão (V) ao longo do período selecionado.",
        detalhes: [
          "Mostra dois gráficos empilhados: o de cima é potência, o de baixo é tensão.",
          "Use o Filtro de Período acima para mudar o intervalo (Tudo, 7 dias, 30 dias, ou meses específicos).",
        ],
      },
      {
        icone: "pie",
        nome: "Consumo por Turno",
        cor: "#F59E0B",
        resumo: "Quanto do consumo total aconteceu em cada faixa do dia.",
        detalhes: [
          "Madrugada (00h–06h): normalmente o período de menor consumo.",
          "Manhã (06h–12h), Tarde (12h–18h), Noite (18h–00h): onde costuma concentrar o uso residencial.",
          "O turno com maior consumo aparece destacado como 'Pico'.",
        ],
      },
      {
        icone: "range",
        nome: "Previsão Mensal (IC 95%)",
        cor: "var(--color-warning)",
        resumo: "Estimativa da fatura final do mês com intervalo de confiança.",
        detalhes: [
          "A linha central é a previsão pontual. A faixa colorida representa o Intervalo de Confiança de 95% — ou seja, em 95% dos cenários, a fatura ficará dentro dessa faixa.",
          "Quanto mais larga a faixa, mais incerta a previsão (geralmente no início do mês, com poucos dados).",
        ],
      },
      {
        icone: "box",
        nome: "BoxPlot",
        cor: "var(--color-secondary)",
        resumo: "Distribuição estatística dos valores — mostra mediana, quartis e outliers.",
        detalhes: [
          "A caixa central vai do 1º ao 3º quartil (onde estão 50% das leituras).",
          "A linha do meio é a mediana (valor típico).",
          "As hastes (whiskers) mostram o mínimo e máximo esperados.",
        ],
      },
    ],
  },
];

function IconeBox({ icone, cor }) {
  return (
    <div className={styles.iconeBox} style={{ color: cor, background: `${cor}1a`, borderColor: `${cor}33` }}>
      <span className={styles.iconeSvg}>{Icones[icone]}</span>
    </div>
  );
}

function ItemCartao({ item }) {
  return (
    <motion.div
      className={styles.itemCard}
      variants={fadeUp}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.itemHeader}>
        <IconeBox icone={item.icone} cor={item.cor} />
        <div>
          <h3 className={styles.itemNome}>{item.nome}</h3>
          <p className={styles.itemResumo}>{item.resumo}</p>
        </div>
      </div>
      <ul className={styles.itemDetalhes}>
        {item.detalhes.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function Secao({ secao, index }) {
  return (
    <motion.section
      className={styles.secao}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      id={secao.id}
    >
      <motion.div className={styles.secaoHeader} variants={fadeUp}>
        <span className={styles.secaoNumero}>0{index + 1}</span>
        <h2 className={styles.secaoTitulo}>{secao.titulo}</h2>
        <p className={styles.secaoResumo}>{secao.resumo}</p>
      </motion.div>

      <div className={styles.itensGrid}>
        {secao.itens.map((item) => (
          <ItemCartao key={item.nome} item={item} />
        ))}
      </div>
    </motion.section>
  );
}

function IndiceRapido({ secoes }) {
  return (
    <motion.nav
      className={styles.indice}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <span className={styles.indiceLabel}>Ir para:</span>
      {secoes.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={styles.indiceLink}>
          {s.titulo}
        </a>
      ))}
    </motion.nav>
  );
}

export default function Glossario() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.heroTagDot} />
            Documentação
          </motion.div>

          <motion.h1
            className={styles.heroTitulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Glossário de <span className={styles.gradiente}>Métricas</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Aprenda a ler cada dado do seu Dashboard. De kWh a Fator de Potência
            — tudo explicado em linguagem simples, sem jargão técnico.
          </motion.p>

          <IndiceRapido secoes={SECOES} />
        </div>
      </section>

      <div className={styles.secoesWrap}>
        {SECOES.map((s, i) => (
          <Secao key={s.id} secao={s} index={i} />
        ))}

        <motion.section
          className={styles.callout}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.calloutTitulo}>Ainda ficou na dúvida?</h2>
          <p className={styles.calloutTexto}>
            O Dashboard é alimentado em tempo real por um sensor IoT instalado
            no equipamento monitorado. Cada métrica que você vê foi calculada
            a partir das leituras brutas de tensão, corrente e potência ativa.
          </p>
          <p className={styles.calloutAssinatura}>
            Projeto Integrador · 4º Semestre · DSM
          </p>
        </motion.section>
      </div>
    </main>
  );
}

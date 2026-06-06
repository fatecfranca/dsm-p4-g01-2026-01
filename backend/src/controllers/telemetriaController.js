import { prisma } from "../database/client.js";
import { broadcastLeitura } from "../websocket.js";
import {
  calcularMedia,
  calcularQuartis,
  calcularModa,
  calcularDesvioPadrao,
  calcularEstratosPorTurno,
  regressaoLinearCusto,
  calcularIntervaloConfianca,
  obterAmostraAleatoria,
} from "../utils/estatisticas.js";

const TARIFA_KWH = parseFloat(process.env.TARIFA_KWH) || 0.85;
const CAMPOS = [
  "voltagem",
  "corrente",
  "potenciaAtiva",
  "frequencia",
  "fatorPotencia",
];

function computeDomain(values) {
  if (!values || values.length < 2) return [0, 100];
  const sorted = [...values].sort((a, b) => a - b);
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const min = Math.max(0, p5 * 0.8);
  const max = p95 * 1.3;
  return max > min
    ? [+min.toFixed(2), +max.toFixed(2)]
    : [0, +(+max || 100).toFixed(2)];
}

function computeInsight(latest, avg, min, max, campo) {
  let status = "normal";
  let text = "Dentro do esperado";
  let trend = "stable";

  if (latest > avg * 1.1) {
    trend = "up";
    status = "warning";
    text = "Acima da média";
  } else if (latest < avg * 0.9) {
    trend = "down";
    status = "success";
    text = "Abaixo da média";
  }

  if (campo === "voltagem") {
    if (latest > 135 || latest < 110) {
      status = "danger";
      text = "Risco de dano";
    }
  }

  return { status, text, trend };
}

export const registrarTelemetria = async (req, res) => {
  try {
    const {
      dispositivoId,
      voltagem,
      corrente,
      potenciaAtiva,
      frequencia,
      fatorPotencia,
    } = req.body;

    if (!dispositivoId || voltagem == null || corrente == null) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const potenciaKw = potenciaAtiva ? potenciaAtiva / 1000 : 0;
    const custoHora = potenciaKw * TARIFA_KWH;

    const novaLeitura = await prisma.telemetria.create({
      data: {
        dispositivoId,
        voltagem,
        corrente,
        potenciaAtiva,
        potenciaKw,
        frequencia: frequencia || null,
        fatorPotencia: fatorPotencia || null,
        custoHora,
      },
    });

    broadcastLeitura(novaLeitura);

    return res.status(201).json(novaLeitura);
  } catch (error) {
    console.error("Erro ao registrar telemetria:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const obterTelemetria = async (req, res) => {
  try {
    const { dispositivoId } = req.params;
    const { limite, dataInicio, dataFim } = req.query;

    const whereClause = { dispositivoId };

    if (dataInicio && dataFim) {
      whereClause.timestamp = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim),
      };
    }

    let data = await prisma.telemetria.findMany({
      where: whereClause,
      take: limite ? parseInt(limite) : 1000,
      orderBy: { timestamp: "desc" },
    });

    data = data.reverse();

    if (!data || data.length === 0) {
      return res.status(200).json({ history: [], insights: {} });
    }

    let custoTotal = 0;
    for (let i = 1; i < data.length; i++) {
      const dt =
        (new Date(data[i].timestamp) - new Date(data[i - 1].timestamp)) /
        3600000;
      custoTotal += (data[i].custoHora || 0) * dt;
    }

    const insights = {
      custoTotal: Number(custoTotal.toFixed(2)),
    };

    CAMPOS.forEach((campo) => {
      const validValues = data.map((d) => d[campo]).filter((v) => v != null);
      if (validValues.length > 0) {
        const latest = validValues[validValues.length - 1];
        const avg = validValues.reduce((a, b) => a + b, 0) / validValues.length;
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);

        insights[campo] = {
          current: Number(latest.toFixed(2)),
          avg: Number(avg.toFixed(2)),
          min: Number(min.toFixed(2)),
          max: Number(max.toFixed(2)),
          domain: computeDomain(validValues),
          ...computeInsight(latest, avg, min, max, campo),
        };
      }
    });

    return res.status(200).json({ history: data, insights });
  } catch (error) {
    console.error("Erro ao obter telemetria:", error);
    return res.status(500).json({ error: "Erro interno ao buscar dados." });
  }
};

export const obterEstatisticas = async (req, res) => {
  try {
    const { dispositivoId } = req.params;
    const { dataInicio, dataFim } = req.query;

    const whereClause = { dispositivoId };
    if (dataInicio && dataFim) {
      whereClause.timestamp = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim),
      };
    }

    const leituras = await prisma.telemetria.findMany({
      where: whereClause,
      orderBy: { timestamp: "asc" },
    });

    if (!leituras || leituras.length === 0) {
      return res
        .status(404)
        .json({ message: "Sem dados suficientes para estatística." });
    }

    // ESTATÍSTICA DESCRITIVA (POPULAÇÃO FILTRADA)

    const descritiva = {};

    CAMPOS.forEach((campo) => {
      const valores = leituras
        .map((l) => l[campo])
        .filter((v) => v !== null && v !== undefined);

      if (valores.length > 0) {
        const media = calcularMedia(valores);

        descritiva[campo] = {
          media: Number(media.toFixed(2)),
          desvioPadrao: Number(calcularDesvioPadrao(valores, media).toFixed(2)),
          boxPlot: calcularQuartis(valores),
          moda: Number(calcularModa(valores, 2)),
        };

        descritiva[campo].mediana = Number(
          descritiva[campo].boxPlot.mediana.toFixed(2),
        );
      } else {
        descritiva[campo] = null;
      }
    });

    // AMOSTRAGEM ESTRATIFICADA
    const consumoPorTurno = calcularEstratosPorTurno(leituras);

    // ESTATÍSTICA INFERENCIAL E PREDITIVA (AMOSTRA DE 500)

    const amostraLeituras = obterAmostraAleatoria(leituras, 500);
    const dadosRegressaoAmostra = regressaoLinearCusto(amostraLeituras);

    const valoresCustoAmostra = amostraLeituras.map((l) => l.custoHora || 0);
    const mediaCustoAmostra = calcularMedia(valoresCustoAmostra);
    const desvioCustoAmostra = calcularDesvioPadrao(
      valoresCustoAmostra,
      mediaCustoAmostra,
    );

    let custoTotalAtual = 0;
    for (let i = 1; i < leituras.length; i++) {
      const dt =
        (new Date(leituras[i].timestamp) -
          new Date(leituras[i - 1].timestamp)) /
        3600000;
      custoTotalAtual += (leituras[i].custoHora || 0) * dt;
    }

    const estimativaMensal = mediaCustoAmostra * 24 * 30;
    const desvioMensal = desvioCustoAmostra * 24 * 30;

    const intervaloCusto = calcularIntervaloConfianca(
      estimativaMensal,
      desvioMensal,
      amostraLeituras.length,
    );

    return res.status(200).json({
      descritiva,
      estratificada: {
        consumoPorTurno,
      },
      preditiva: {
        metodo: "Amostragem Aleatória Simples",
        tamanhoAmostra: amostraLeituras.length,
        tendenciaDeCusto:
          dadosRegressaoAmostra.tendencia > 0 ? "Aumentando" : "Estável",
        custoAtualReal: Number(custoTotalAtual.toFixed(2)),
        previsaoFaturaMensal: Number(estimativaMensal.toFixed(2)),
        intervaloConfianca95: {
          minimoEsperado: Number(Math.max(0, intervaloCusto.min).toFixed(2)),
          maximoEsperado: Number(intervaloCusto.max.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao calcular estatísticas:", error);
    return res.status(500).json({ error: "Erro interno ao processar dados." });
  }
};

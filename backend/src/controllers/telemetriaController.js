import { prisma } from "../database/client.js";
import {
  calcularMedia,
  calcularQuartis,
  calcularModa,
  calcularDesvioPadrao,
  calcularEstratosPorTurno,
  regressaoLinearCusto,
  calcularIntervaloConfianca,
} from "../utils/estatisticas.js";

const TARIFA_KWH = parseFloat(process.env.TARIFA_KWH) || 0.85;
const CAMPOS = ["voltagem", "corrente", "potenciaAtiva"];

function computeDomain(values) {
  if (!values || values.length < 2) return [0, 100];
  const sorted = [...values].sort((a, b) => a - b);
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const min = Math.max(0, p5 * 0.8);
  const max = p95 * 1.3;
  return max > min ? [+min.toFixed(2), +max.toFixed(2)] : [0, +(+max || 100).toFixed(2)];
}

function computeInsight(latest, avg, min, max) {
  if (avg === undefined || latest === undefined || latest === null) {
    return { type: "empty", text: "Sem dados disponíveis" };
  }
  if (latest > avg * 1.1) {
    const pct = Math.round((latest / avg - 1) * 100);
    return { type: "above", pct, text: `Valor atual ${pct}% acima da média.` };
  }
  if (latest < avg * 0.9) {
    const pct = Math.round((1 - latest / avg) * 100);
    return { type: "below", pct, text: `Valor atual ${pct}% abaixo da média.` };
  }
  return { type: "normal", text: `Operação dentro da faixa esperada (${min}–${max}).` };
}

function toBR(ts) {
  return new Date(ts).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export const registrarTelemetria = async (req, res) => {
  try {
    const { dispositivoId, voltagem, corrente, potenciaAtiva, potenciaAparente, potenciaReativa, fatorPotencia, frequencia } = req.body;

    if (!dispositivoId || voltagem === undefined || corrente === undefined || potenciaAtiva === undefined) {
      return res.status(400).json({
        error: "Dados incompletos. dispositivoId, voltagem, corrente e potenciaAtiva são obrigatórios.",
      });
    }

    const potenciaKw = potenciaAtiva / 1000;
    const custoHora = potenciaKw * TARIFA_KWH;

    const novaLeitura = await prisma.telemetria.create({
      data: { dispositivoId, voltagem, corrente, potenciaAtiva, potenciaAparente, potenciaReativa, fatorPotencia, frequencia, potenciaKw, custoHora },
    });

    return res.status(201).json({ message: "Leitura de energia registrada com sucesso!", data: novaLeitura });
  } catch (error) {
    console.error("Erro na ingestão de dados:", error);
    return res.status(500).json({ error: "Erro interno ao salvar os dados da telemetria." });
  }
};

export const obterTelemetria = async (req, res) => {
  try {
    const { dispositivoId } = req.params;
    const { start, end } = req.query;

    const limiteRaw = parseInt(req.query.limite);
    const limite = !isNaN(limiteRaw) ? Math.min(Math.max(limiteRaw, 1), 1000) : 100;

    const where = { dispositivoId };
    if (start || end) {
      where.timestamp = {};
      if (start) where.timestamp.gte = new Date(start);
      if (end) where.timestamp.lte = new Date(`${end}T23:59:59.999Z`);
    }

    const leituras = await prisma.telemetria.findMany({
      where,
      orderBy: { timestamp: "asc" },
      take: limite,
    });

    if (!leituras || leituras.length === 0) {
      return res.status(404).json({ message: "Nenhuma leitura encontrada para este dispositivo." });
    }

    const data = leituras.map((l) => ({
      ...l,
      potenciaKw: l.potenciaKw ?? +(l.potenciaAtiva / 1000).toFixed(6),
      custoHora: l.custoHora ?? +((l.potenciaAtiva / 1000) * TARIFA_KWH).toFixed(6),
      dataHoraBrasil: toBR(l.timestamp),
    }));

    const latest = data[data.length - 1];

    const descritiva = {};
    const insights = {};
    CAMPOS.forEach((field) => {
      const vals = data.map((r) => r[field]).filter((v) => v != null && isFinite(v));

      if (vals.length === 0) {
        descritiva[field] = null;
        insights[field] = computeInsight(undefined, undefined, undefined, undefined);
        return;
      }

      const sorted = [...vals].sort((a, b) => a - b);
      const media = calcularMedia(vals);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];

      descritiva[field] = {
        media: +media.toFixed(2),
        desvioPadrao: +calcularDesvioPadrao(vals, media).toFixed(2),
        boxPlot: calcularQuartis(vals),
        moda: calcularModa(vals),
        min: +min.toFixed(2),
        max: +max.toFixed(2),
        domain: computeDomain(vals),
      };

      insights[field] = computeInsight(latest[field], media, min, max);
    });

    const consumoPorTurno = calcularEstratosPorTurno(data);
    const dadosRegressao = regressaoLinearCusto(data);

    const custoTotalAtual = data.reduce((acc, l) => acc + (l.custohora || l.custoHora || 0), 0);
    const mediaCustoDiario = custoTotalAtual / (data.length / 24);
    const desvioCusto = calcularDesvioPadrao(
      data.map((l) => l.custoHora || 0),
      mediaCustoDiario,
    );
    const intervaloCusto = calcularIntervaloConfianca(custoTotalAtual, desvioCusto * 30, data.length);

    const preditiva = {
      tendenciaDeCusto: dadosRegressao.tendencia > 0 ? "Aumentando" : "Estável",
      custoAtual: +custoTotalAtual.toFixed(2),
      intervaloConfianca95: {
        minimoEsperado: +intervaloCusto.min.toFixed(2),
        maximoEsperado: +intervaloCusto.max.toFixed(2),
      },
    };

    return res.status(200).json({
      data,
      meta: {
        total: data.length,
        latest,
        descritiva,
        insights,
        estratificada: { consumoPorTurno },
        preditiva,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return res.status(500).json({ error: "Erro interno ao buscar os dados da telemetria." });
  }
};

// ─── Endpoint do parceiro mantido: estatísticas avançadas ───

export const obterEstatisticas = async (req, res) => {
  try {
    const { dispositivoId } = req.params;

    const leituras = await prisma.telemetria.findMany({
      where: { dispositivoId },
      orderBy: { timestamp: "asc" },
    });

    if (!leituras || leituras.length === 0) {
      return res.status(404).json({ message: "Sem dados suficientes para estatística." });
    }

    const voltagens = leituras.map((l) => l.voltagem).filter((v) => v !== null);
    const potencias = leituras.map((l) => l.potenciaAtiva).filter((p) => p !== null);

    const mediaVoltagem = calcularMedia(voltagens);
    const desvioPadraoVoltagem = calcularDesvioPadrao(voltagens, mediaVoltagem);
    const quartisVoltagem = calcularQuartis(voltagens);
    const modaPotencia = calcularModa(potencias);
    const medianaPotencia = calcularQuartis(potencias).mediana;

    const consumoPorTurno = calcularEstratosPorTurno(leituras);
    const dadosRegressao = regressaoLinearCusto(leituras);

    const custoTotalAtual = leituras.reduce((acc, l) => acc + (l.custoReais || l.custoHora || 0), 0);
    const mediaCustoDiario = custoTotalAtual / (leituras.length / 24);
    const desvioCusto = calcularDesvioPadrao(
      leituras.map((l) => l.custoReais || l.custoHora || 0),
      mediaCustoDiario,
    );
    const intervaloCusto = calcularIntervaloConfianca(custoTotalAtual, desvioCusto * 30, leituras.length);

    return res.status(200).json({
      descritiva: {
        voltagem: {
          media: mediaVoltagem.toFixed(2),
          desvioPadrao: desvioPadraoVoltagem.toFixed(2),
          boxPlot: quartisVoltagem,
        },
        potencia: {
          moda: modaPotencia,
          mediana: medianaPotencia.toFixed(2),
        },
      },
      estratificada: { consumoPorTurno },
      preditiva: {
        tendenciaDeCusto: dadosRegressao.tendencia > 0 ? "Aumentando" : "Estável",
        custoAtual: custoTotalAtual.toFixed(2),
        intervaloConfianca95: {
          minimoEsperado: intervaloCusto.min.toFixed(2),
          maximoEsperado: intervaloCusto.max.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao calcular estatísticas:", error);
    return res.status(500).json({ error: "Erro interno ao processar dados." });
  }
};

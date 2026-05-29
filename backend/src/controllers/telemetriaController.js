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

export const registrarTelemetria = async (req, res) => {
  try {
    // Dados enviados pelo IoT no formato JSON
    const {
      dispositivoId,
      voltagem,
      corrente,
      potenciaAtiva,
      potenciaAparente,
      potenciaReativa,
      fatorPotencia,
      frequencia,
    } = req.body;

    // Validação básica para garantir que o IoT enviou os dados essenciais
    if (
      !dispositivoId ||
      voltagem === undefined ||
      corrente === undefined ||
      potenciaAtiva === undefined
    ) {
      return res.status(400).json({
        error:
          "Dados incompletos. dispositivoId, voltagem, corrente e potenciaAtiva são obrigatórios.",
      });
    }

    // Potência instantânea em quilowatts (kW) e custo por hora (R$/h)
    const potenciaKw = potenciaAtiva / 1000;
    const custoHora = potenciaKw * TARIFA_KWH;

    // Salva o documento final no MongoDB
    const novaLeitura = await prisma.telemetria.create({
      data: {
        dispositivoId,
        voltagem,
        corrente,
        potenciaAtiva,
        potenciaAparente,
        potenciaReativa,
        fatorPotencia,
        frequencia,
        potenciaKw,
        custoHora,
        // O timestamp é gerado automaticamente pelo Prisma
      },
    });

    return res.status(201).json({
      message: "Leitura de energia registrada com sucesso!",
      data: novaLeitura,
    });
  } catch (error) {
    console.error("Erro na ingestão de dados:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao salvar os dados da telemetria." });
  }
};

export const obterTelemetria = async (req, res) => {
  try {
    const { dispositivoId } = req.params;

    const limiteRaw = parseInt(req.query.limite);
    const limite = !isNaN(limiteRaw)
      ? Math.min(Math.max(limiteRaw, 1), 1000)
      : 100;

    const leituras = await prisma.telemetria.findMany({
      where: { dispositivoId },
      orderBy: { timestamp: "asc" },
      take: limite,
    });

    if (!leituras || leituras.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma leitura encontrada para este dispositivo." });
    }

    const leiturasFormatadas = leituras.map((leitura) => {
      return {
        ...leitura,
        dataHoraBrasil: new Date(leitura.timestamp).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });

    return res.status(200).json({ data: leiturasFormatadas });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao buscar os dados da telemetria." });
  }
};

export const obterEstatisticas = async (req, res) => {
  try {
    const { dispositivoId } = req.params;

    // Vai buscar todas as leituras do dispositivo para a amostra estatística
    const leituras = await prisma.telemetria.findMany({
      where: { dispositivoId },
      orderBy: { timestamp: "asc" },
    });

    if (!leituras || leituras.length === 0) {
      return res
        .status(404)
        .json({ message: "Sem dados suficientes para estatística." });
    }

    // 1. Preparar os vetores de dados (Arrays)
    const voltagens = leituras.map((l) => l.voltagem).filter((v) => v !== null);
    const potencias = leituras
      .map((l) => l.potenciaAtiva)
      .filter((p) => p !== null);

    // 2. Estatística Descritiva (Voltagem e Potência)
    const mediaVoltagem = calcularMedia(voltagens);
    const desvioPadraoVoltagem = calcularDesvioPadrao(voltagens, mediaVoltagem);
    const quartisVoltagem = calcularQuartis(voltagens);
    const modaPotencia = calcularModa(potencias);
    const medianaPotencia = calcularQuartis(potencias).mediana;

    // 3. Amostragem Estratificada Proporcional (Consumo por Turno do Dia)
    const consumoPorTurno = calcularEstratosPorTurno(leituras);

    // 4. Estatística Preditiva e Inferencial (Custos)
    const dadosRegressao = regressaoLinearCusto(leituras);

    // Calcular estimativa de custo total
    const custoTotalAtual = leituras.reduce(
      (acc, l) => acc + (l.custoReais || 0),
      0,
    );
    const mediaCustoDiario = custoTotalAtual / (leituras.length / 24); // Assumindo 24 leituras/dia
    const desvioCusto = calcularDesvioPadrao(
      leituras.map((l) => l.custoReais || 0),
      mediaCustoDiario,
    );

    // Intervalo de Confiança de 95% para o gasto
    const intervaloCusto = calcularIntervaloConfianca(
      custoTotalAtual,
      desvioCusto * 30,
      leituras.length,
    );

    // 5. Montar o JSON de resposta perfeitamente estruturado para o Dashboard
    return res.status(200).json({
      descritiva: {
        voltagem: {
          media: mediaVoltagem.toFixed(2),
          desvioPadrao: desvioPadraoVoltagem.toFixed(2),
          boxPlot: quartisVoltagem, // q1, mediana, q3 para desenhar o gráfico
        },
        potencia: {
          moda: modaPotencia, // Ex: mostrará os ~60W do ventilador
          mediana: medianaPotencia.toFixed(2),
        },
      },
      estratificada: {
        consumoPorTurno, // Dados para o Gráfico de Barras (Madrugada, Manhã, Tarde, Noite)
      },
      preditiva: {
        tendenciaDeCusto:
          dadosRegressao.tendencia > 0 ? "Aumentando" : "Estável",
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

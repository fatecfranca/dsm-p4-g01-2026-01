import { prisma } from "../database/client.js";

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

    // Lógica de Eficiência: Calcular consumo em kWh e estimar custos em Reais
    // O consumo em kWh para uma hora será (potência em Watts / 1000)
    const consumokWh = potenciaAtiva / 1000;
    const custoReais = consumokWh * TARIFA_KWH;

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
        consumokWh,
        custoReais,
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

    // Pega o limite de registros pela URL (ex: /api/telemetria/ESP32_01?limite=50)
    const limite = req.query.limite ? parseInt(req.query.limite) : 100;

    // Busca os dados no MongoDB ordenados do mais recente para o mais antigo
    const leituras = await prisma.telemetria.findMany({
      where: { dispositivoId },
      orderBy: { timestamp: "desc" },
      take: limite,
    });

    if (!leituras || leituras.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma leitura encontrada para este dispositivo." });
    }

    return res.status(200).json({ data: leituras });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao buscar os dados da telemetria." });
  }
};

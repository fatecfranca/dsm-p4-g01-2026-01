import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Monitorização de Energia IoT",
      version: "1.0.0",
      description:
        "API desenvolvida para receber dados de telemetria de dispositivos ESP32 e fornecer estatísticas para Dashboards.",
    },
    servers: [
      {
        url: "https://dsm-p4-g01-2026-01.onrender.com/api",
        description: "Servidor de Produção (Render)",
      },
      {
        url: "http://localhost:3000/api",
        description: "Servidor Local (Desenvolvimento)",
      },
      {
        url: "https://ecosense.chilecentral.cloudapp.azure.com/api",
        description: "Servidor Azure (Produção)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/auth/cadastro": {
        post: {
          tags: ["Autenticação"],
          summary: "Registar novo utilizador",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string", example: "João Silva" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "joao@exemplo.com",
                    },
                    senha: { type: "string", example: "senha123!" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Utilizador registado com sucesso." },
            400: { description: "Erro de validação." },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Autenticação"],
          summary: "Iniciar sessão",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "joao@exemplo.com",
                    },
                    senha: { type: "string", example: "senha123!" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado com sucesso. Devolve o Token.",
            },
            401: { description: "Credenciais inválidas." },
          },
        },
      },
      "/telemetria/ingestao": {
        post: {
          tags: ["Telemetria (IoT)"],
          summary: "Registar leitura de energia do ESP32",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    dispositivoId: { type: "string", example: "ESP32_SALA_01" },
                    voltagem: { type: "number", example: 127.5 },
                    corrente: { type: "number", example: 2.3 },
                    potenciaAtiva: { type: "number", example: 293.25 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Leitura registada com sucesso." },
          },
        },
      },
      "/telemetria/{dispositivoId}": {
        get: {
          tags: ["Telemetria (Dashboard)"],
          summary: "Obter leituras de um dispositivo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "dispositivoId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "O ID do dispositivo (Ex: ESP32_SALA_01)",
            },
            {
              name: "limite",
              in: "query",
              required: false,
              schema: { type: "integer" },
              description: "Quantidade de registos (Padrão: 100)",
            },
          ],
          responses: {
            200: { description: "Lista de leituras." },
            401: { description: "Não autorizado." },
          },
        },
      },
      "/telemetria/estatisticas/{dispositivoId}": {
        get: {
          tags: ["Telemetria"],
          summary: "Obter estatísticas descritivas e preditivas do dispositivo",
          description:
            "Retorna cálculos matemáticos baseados na população de dados (descritiva) e previsões de custo projetadas para 30 dias usando Amostragem Aleatória Simples (preditiva).",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "dispositivoId",
              in: "path",
              required: true,
              description: "ID único do dispositivo (ex: ESP32_VENTILADOR)",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Estatísticas calculadas com sucesso.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      descritiva: {
                        type: "object",
                        description:
                          "Média, Moda, Mediana e Desvio Padrão dos componentes elétricos.",
                        example: {
                          voltagem: {
                            media: "127.05",
                            desvioPadrao: "0.58",
                            boxPlot: { q1: 126.5, mediana: 127.1, q3: 127.6 },
                            moda: 127.1,
                            mediana: "127.10",
                          },
                        },
                      },
                      estratificada: {
                        type: "object",
                        description:
                          "Consumo total de energia dividido por turnos do dia.",
                        example: {
                          consumoPorTurno: {
                            madrugada: 2.5,
                            manha: 1.2,
                            tarde: 4.8,
                            noite: 6.1,
                          },
                        },
                      },
                      preditiva: {
                        type: "object",
                        description:
                          "Previsão de fatura baseada em regressão linear de amostra.",
                        example: {
                          metodo: "Amostragem Aleatória Simples",
                          tamanhoAmostra: 500,
                          tendenciaDeCusto: "Aumentando",
                          custoAtualReal: "12.50",
                          previsaoFaturaMensal: "85.00",
                          intervaloConfianca95: {
                            minimoEsperado: "81.50",
                            maximoEsperado: "88.50",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Não autorizado. Token ausente ou inválido." },
            404: { description: "Sem dados suficientes para estatística." },
            500: { description: "Erro interno ao processar dados." },
          },
        },
      },
    },
  },
  apis: [],
};

export default swaggerJsdoc(options);

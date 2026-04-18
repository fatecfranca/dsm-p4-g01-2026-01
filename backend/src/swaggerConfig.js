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
    },
  },

  apis: [],
};

export default swaggerJsdoc(options);

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import specs from "./swaggerConfig.js";

// Importação das rotas
import telemetriaRoutes from "./routes/telemetriaRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota para a interface visual do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Registro das rotas na API
app.use("/api/telemetria", telemetriaRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de Monitoramento de Energia rodando na porta ${PORT}`);
  console.log(
    `Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`,
  );
});

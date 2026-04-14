import express from "express";
import cors from "cors";

import telemetriaRoutes from "./routes/telemetriaRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/telemetria", telemetriaRoutes);

// Exportar app ou rodar diretamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Monitoramento de Energia rodando na porta ${PORT}`);
});

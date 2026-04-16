import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Importação das rotas
import telemetriaRoutes from "./routes/telemetriaRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Registro das rotas na API
app.use("/api/telemetria", telemetriaRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de Monitoramento de Energia rodando na porta ${PORT}`);
});

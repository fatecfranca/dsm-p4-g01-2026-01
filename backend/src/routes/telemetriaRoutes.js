import { Router } from "express";
import {
  registrarTelemetria,
  obterTelemetria,
  obterEstatisticas,
} from "../controllers/telemetriaController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

// Rota de INGESTÃO: O ESP32 fará um POST para /api/telemetria/ingestao
router.post("/ingestao", registrarTelemetria);

// Rota de CONSUMO: GET para /api/telemetria/{dispositivoId}
router.get("/:dispositivoId", verifyToken, obterTelemetria);

// Rota de ESTATÍSTICAS: GET para /api/telemetria/estatisticas/{dispositivoId}
router.get("/estatisticas/:dispositivoId", verifyToken, obterEstatisticas);

export default router;

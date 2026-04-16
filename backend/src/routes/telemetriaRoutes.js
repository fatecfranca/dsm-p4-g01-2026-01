import { Router } from "express";
import {
  registrarTelemetria,
  obterTelemetria,
} from "../controllers/telemetriaController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

// Rota de INGESTÃO: O ESP32 fará um POST para /api/telemetria/ingestao
router.post("/ingestao", registrarTelemetria);

// Rota de CONSUMO: GET para /api/telemetria/{dispositivoId}
router.get("/:dispositivoId", verifyToken, obterTelemetria);

export default router;

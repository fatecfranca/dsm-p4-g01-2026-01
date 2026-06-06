import { Router } from "express";
import {
  registrarTelemetria,
  obterTelemetria,
  obterEstatisticas,
} from "../controllers/telemetriaController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/ingestao", registrarTelemetria);
router.get("/estatisticas/:dispositivoId", verifyToken, obterEstatisticas);
router.get("/:dispositivoId", verifyToken, obterTelemetria);

export default router;

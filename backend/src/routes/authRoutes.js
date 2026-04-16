import { Router } from "express";
import { cadastro, login } from "../controllers/authController.js";

const router = Router();

// Rota para criar uma nova conta (POST /api/auth/cadastro)
router.post("/cadastro", cadastro);

// Rota para fazer login e receber o token (POST /api/auth/login)
router.post("/login", login);

export default router;

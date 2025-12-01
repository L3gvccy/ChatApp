import { Router } from "express";
import { register } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/register", register)

export default authRoutes
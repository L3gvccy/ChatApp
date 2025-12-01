import { Router } from "express";
import { register } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/regiter", register)

export default authRoutes
import { Router } from "express";
import { updateProfile } from "../controllers/ProfileController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const profileRoutes = Router();

profileRoutes.post("/update-profile", verifyToken, updateProfile);

export default profileRoutes;

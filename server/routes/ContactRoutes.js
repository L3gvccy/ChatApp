import { Router } from "express";
import { searchContacts } from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = new Router();

contactRoutes.post("/search-contacts", verifyToken, searchContacts);

export default contactRoutes;

import { Router } from "express";
import {
  getContactsDM,
  searchContacts,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = new Router();

contactRoutes.post("/search-contacts", verifyToken, searchContacts);
contactRoutes.get("/get-contacts-dm", verifyToken, getContactsDM);

export default contactRoutes;

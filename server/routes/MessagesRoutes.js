import { Router } from "express";
import {
  downloadFile,
  getMessages,
  uploadFile,
} from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const messagesRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post(
  "/upload-file",
  upload.single("file"),
  verifyToken,
  uploadFile
);
messagesRoutes.get("/download-file", verifyToken, downloadFile);

export default messagesRoutes;

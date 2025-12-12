import { Router } from "express";
import {
  downloadFile,
  getChannelMessages,
  getMessages,
  uploadFile,
} from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const messagesRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/get-channel-messages", verifyToken, getChannelMessages);
messagesRoutes.post(
  "/upload-file",
  upload.single("file"),
  verifyToken,
  uploadFile
);
messagesRoutes.get("/download-file", verifyToken, downloadFile);

export default messagesRoutes;

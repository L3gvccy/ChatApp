import { Router } from "express";
import {
  downloadFile,
  getChannelMessages,
  getMessages,
  getNumberOfUnreadMessages,
  markMessagesAsRead,
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
messagesRoutes.post("/mark-as-read", verifyToken, markMessagesAsRead);
messagesRoutes.post(
  "/get-unread-messages-count",
  verifyToken,
  getNumberOfUnreadMessages
);

export default messagesRoutes;

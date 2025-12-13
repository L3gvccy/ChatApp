import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  addChannelMember,
  deleteChannel,
  deleteChannelImage,
  getAllChannels,
  updateChannelName,
  uploadChannelImage,
} from "../controllers/ChannelController.js";
import multer from "multer";

const channelRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

channelRoutes.get("/get-channels", verifyToken, getAllChannels);
channelRoutes.post(
  "/upload-channel-image",
  upload.single("image"),
  verifyToken,
  uploadChannelImage
);
channelRoutes.post("/delete-channel-image", verifyToken, deleteChannelImage);
channelRoutes.post("/update-channel-name", verifyToken, updateChannelName);
channelRoutes.post("/add-channel-member", verifyToken, addChannelMember);
channelRoutes.post("/delete-channel", verifyToken, deleteChannel);

export default channelRoutes;

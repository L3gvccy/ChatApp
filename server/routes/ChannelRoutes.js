import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllChannels } from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.get("/get-channels", verifyToken, getAllChannels);

export default channelRoutes;

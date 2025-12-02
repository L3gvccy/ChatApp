import { Router } from "express";
import {
  deleteProfileImage,
  updateProfile,
  uploadProfileImage,
} from "../controllers/ProfileController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const profileRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

profileRoutes.post("/update-profile", verifyToken, updateProfile);
profileRoutes.post(
  "/upload-profile-image",
  upload.single("image"),
  verifyToken,
  uploadProfileImage
);
profileRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);

export default profileRoutes;

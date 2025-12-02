import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import "./config/cloudinaryConfig.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const dbUrl = process.env.DB_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log(`MongoDB is ready!`);
  })
  .catch((err) => {
    console.log(`Error while connecting to MongoDB: ${err}`);
  });

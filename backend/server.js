import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

import employeeRouter from "./routes/employeeRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4200", // use your frontend domain on production
    credentials: true,
  })
);

// Serve Angular static files
app.use(express.static(path.join(__dirname, "../frontend/dist/frontend"))); // adjust "frontend" if your app name is different

// API routes
app.use("/api/employees", employeeRouter);
app.use("/api/reviews", reviewRouter);

// Fallback route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/frontend/index.html")); // correct path
});

// Connect to MongoDB and start server
mongoose.connect(mongoUrl).then(() => {
  console.log(`server is connected to mongodb`);
  app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
  });
});

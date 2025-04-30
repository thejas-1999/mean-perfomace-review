import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

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
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../frontend/dist/frontend")));

app.use("/api/employees", employeeRouter);
app.use("/api/reviews", reviewRouter);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/frontend/browser/index.html")
  );
});

mongoose.connect(mongoUrl).then(() => {
  console.log(`server is connected to mongodb`);
  app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
  });
});

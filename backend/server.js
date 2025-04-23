import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
import employeeRouter from "./routes/employeeRoutes.js";

const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`Hello world`);
});

app.use("/api/employees", employeeRouter);

mongoose.connect(mongoUrl).then(() => {
  console.log(`server is connected to mongodb`);
  app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
  });
});

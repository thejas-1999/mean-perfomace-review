import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = process.env.PORT || 8000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Hello world`);
});

app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});

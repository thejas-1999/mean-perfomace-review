import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`Hello world`);
});

mongoose.connect(mongoUrl).then(() => {
  console.log(`server is connected to mongodb`);
  app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
  });
});

import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { createEmployee, loginEmployee } from "../controls/employeeControl.js";

const router = express.Router();

router.post("/createEmployee", protect, admin, createEmployee);

router.post("/login", loginEmployee);

export default router;

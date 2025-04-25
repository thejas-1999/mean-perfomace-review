import express from "express";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  loginEmployee,
  updateEmployee,
} from "../controls/employeeControl.js";

const router = express.Router();

router.get("/", getAllEmployees);
router.post("/createEmployee", createEmployee);

router.post("/login", loginEmployee);

router.put("/update/:id", updateEmployee);

router.delete("/delete/:id", deleteEmployee);

export default router;

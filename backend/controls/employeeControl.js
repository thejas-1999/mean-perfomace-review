import Employee from "../models/employeeModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await Employee.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      email,
      password: hashedPassword,
    });

    await employee.save();

    res.status(201).json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, employee._id); // Set the cookie

    res.json({
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createEmployee, loginEmployee };

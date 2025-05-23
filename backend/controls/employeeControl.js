import Employee from "../models/employeeModel.js";
import bcrypt from "bcryptjs";

import Review from "../models/reviewModel.js";

//get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ err: err.message });
  }
};

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

    // Send the response with the employee data
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

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { name, email, password, role } = req.body;

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.role = role || employee.role;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }

    const updatedEmployee = await employee.save();

    res.json({
      _id: updatedEmployee._id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 1. Delete reviews where the employee is the reviewee
    await Review.deleteMany({ reviewee: employee._id });

    // 2. Remove employee from assigned reviewers and their feedback entries
    await Review.updateMany(
      { assignedReviewers: employee._id },
      {
        $pull: {
          assignedReviewers: employee._id,
          feedback: { reviewer: employee._id },
        },
      }
    );

    // 3. Delete the employee
    await employee.deleteOne();

    res.json({ message: "Employee and related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createEmployee,
  loginEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
};

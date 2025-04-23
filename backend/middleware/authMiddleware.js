import jwt from "jsonwebtoken";
import Employee from "../models/employeeModel.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Employee.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

// Role-based access middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

export { protect, admin };

const express = require("express");
const User = require("../models/User.js");
const Request = require("../models/Request.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

// Get all users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Admin Users Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a user (Admin Only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all requests (Admin Only)
router.get("/requests", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const requests = await Request.find().populate("user", "name email");
    res.json({ requests });
  } catch (error) {
    console.error("Admin Requests Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a request (Admin Only)
router.delete("/requests/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Delete Request Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

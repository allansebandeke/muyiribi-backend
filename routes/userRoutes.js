const express = require("express");
const User = require("../models/User.js");
const Request = require("../models/Request.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Get User Profile Data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await Request.find({ user: req.user.id });

    res.json({ user, requests });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User Dashboard Data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await Request.find({ user: req.user.id });

    res.json({ user, requests });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

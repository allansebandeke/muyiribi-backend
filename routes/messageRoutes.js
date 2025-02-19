const express = require("express");
const Message = require("../models/Message.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Send a Message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { recipient, content } = req.body;

    if (!recipient || !content) {
      return res.status(400).json({ message: "Recipient and content are required." });
    }

    const message = new Message({
      sender: req.user.id,
      recipient,
      content,
    });

    await message.save();
    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    console.error("Message Send Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User Messages (Sent & Received)
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    }).populate("sender recipient", "name email").sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

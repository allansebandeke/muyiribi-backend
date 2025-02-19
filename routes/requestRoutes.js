const express = require("express");
const Request = require("../models/Request.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Create a Request
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || budget === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const request = new Request({
      title,
      description,
      budget,
      user: req.user.id,
    });

    await request.save();
    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    console.error("Request Creation Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Edit a Request
router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const request = await Request.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, budget },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("Edit Request Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a Request
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!request) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Delete Request Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Filter Requests
router.get("/filter", authMiddleware, async (req, res) => {
  try {
    const { search, minBudget, maxBudget } = req.query;
    let filter = { user: req.user.id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minBudget) {
      filter.budget = { ...filter.budget, $gte: Number(minBudget) };
    }
    if (maxBudget) {
      filter.budget = { ...filter.budget, $lte: Number(maxBudget) };
    }

    const requests = await Request.find(filter);
    res.json({ requests });
  } catch (error) {
    console.error("Filter Requests Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

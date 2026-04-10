// backend/routes/callLog.js
const express = require("express");
const CallLog = require("../models/CallLog");
const { authenticate } = require("./auth");
const router = express.Router();

// POST a new call log
router.post("/calllog", authenticate, async (req, res) => {
  const { caller, receiver, type, status } = req.body;
  
  if (!caller || !receiver || !type || !status) {
    return res.status(400).json({ message: "Missing required call log fields" });
  }

  try {
    const newLog = new CallLog({
      caller,
      receiver,
      type,
      status,
    });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error("Call log error:", err);
    res.status(500).json({ message: "Server error logging call" });
  }
});

// GET all call logs for the logged-in user
router.get("/calllog", authenticate, async (req, res) => {
  try {
    const username = req.user.username;
    const logs = await CallLog.find({
      $or: [{ caller: username }, { receiver: username }]
    }).sort({ createdAt: -1 }); // Newest first

    res.json(logs);
  } catch (err) {
    console.error("Get call logs error:", err);
    res.status(500).json({ message: "Server error fetching call logs" });
  }
});

module.exports = router;
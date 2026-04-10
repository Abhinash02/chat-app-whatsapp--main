// backend/routes/status.js
const express = require("express");
const Status = require("../models/Status");
const User = require("../models/User"); 
const { authenticate } = require("./auth");
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { text, mediaUrl, mediaType } = req.body; 
  if (!text && !mediaUrl) {
    return res.status(400).json({ message: "Status cannot be empty" });
  }

  try {
    const status = new Status({
      username: req.user.username,
      text,
      mediaUrl,
      mediaType: mediaUrl ? mediaType : null, // Save the media type
    });
    await status.save();
    res.status(201).json(status);
  } catch (err) {
    console.error("Status post error:", err);
    res.status(500).json({ message: "Server error posting status" });
  }
});

// GET ALL STATUSES 
router.get("/all", authenticate, async (req, res) => {
  try {
    const allStatuses = await Status.find({
      username: { $ne: req.user.username },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: "asc" });

    const usernames = [...new Set(allStatuses.map((s) => s.username))];
    const users = await User.find({ username: { $in: usernames } }).select(
      "username profileImage"
    );
    const userMap = users.reduce((acc, user) => {
      acc[user.username] = user.profileImage;
      return acc;
    }, {});

    const grouped = allStatuses.reduce((acc, status) => {
      const username = status.username;
      if (!acc[username]) {
        acc[username] = {
          username: username,
          profileImage: userMap[username] || "/default-avatar.png",
          statuses: [],
        };
      }
      acc[username].statuses.push(status);
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("Get statuses error:", err);
    res.status(500).json({ message: "Server error fetching statuses" });
  }
});

module.exports = router;
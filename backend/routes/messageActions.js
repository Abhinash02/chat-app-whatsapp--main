//messageActions.js
const express = require("express");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const router = express.Router();

//  AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, username }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Bad token" });
  }
};

// DELETE MESSAGE
router.delete("/message/:id", auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg || msg.sender !== req.user.username)
      return res.status(403).json({ msg: "Not yours" });

    msg.isDeleted = true;
    await msg.save();

    // Tell everyone
    req.io.emit("messageDeleted", { messageId: msg._id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

// EDIT MESSAGE
router.put("/message/:id", auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg || msg.sender !== req.user.username)
      return res.status(403).json({ msg: "Not yours" });

    msg.text = req.body.text;
    msg.edited = true;
    await msg.save();

    req.io.emit("messageEdited", msg);
    res.json(msg);
  } catch (e) {
    res.status(500).json({ msg: "Edit failed" });
  }
});

module.exports = router;
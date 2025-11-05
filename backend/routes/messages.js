
// const express = require("express");
// const router = express.Router();
// const { authenticate } = require("./auth");
// const Message = require("../models/Message");

// // GET MESSAGES (No change needed here)
// router.get("/message", authenticate, async (req, res) => {
//   const { receiver } = req.query;
//   const messages = await Message.find({
//     $or: [
//       { sender: req.user.username, receiver },
//       { sender: receiver, receiver: req.user.username }
//     ]
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// // UPDATED SEND MESSAGE ROUTE
// router.post("/message", authenticate, async (req, res) => {
//   // Destructure all fields from the frontend payload
//   const { receiver, text, mediaUrl, type } = req.body;

//   if (!receiver || (!text && !mediaUrl)) {
//     return res.status(400).json({ message: "Invalid message payload" });
//   }

//   try {
//     const message = new Message({
//       sender: req.user.username,
//       receiver,
//       text,
//       mediaUrl, // Save the mediaUrl
//       type,     // Save the type
//     });
    
//     await message.save(); // This will now work for "voice" and "doc"
//     res.status(201).json(message);
  
//   } catch (error) {
//     // This catch block is important for debugging
//     console.error("Error saving message:", error);
//     res.status(500).json({ message: "Failed to save message", error: error.message });
//   }
// });

// module.exports = router;



// backend/routes/messages.js
// routes/messages.js
const express = require("express");
const router = express.Router();
// Make sure this path is correct. If auth.js is in the same folder, this is right.
const { authenticate } = require("./auth");
const Message = require("../models/Message"); // Correctly imports from ../models/

// GET MESSAGES (No change needed)
router.get("/message", authenticate, async (req, res) => {
  const { receiver } = req.query;
  const messages = await Message.find({
    $or: [
      { sender: req.user.username, receiver },
      { sender: receiver, receiver: req.user.username },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// --- UPDATED SEND MESSAGE ROUTE ---
router.post("/message", authenticate, async (req, res) => {
  // Destructure all fields from the frontend payload
  const { receiver, text, mediaUrl, type } = req.body;

  if (!receiver || (!text && !mediaUrl)) {
    return res.status(400).json({ message: "Invalid message payload" });
  }

  try {
    const message = new Message({
      sender: req.user.username,
      receiver,
      text,
      mediaUrl, // Save the mediaUrl
      type, // Save the type
    });

    await message.save(); // This will now work
    res.status(201).json(message); // Send back the saved message
  } catch (error) {
    // This catch block is important for debugging
    console.error("Error saving message:", error);
    res
      .status(500)
      .json({ message: "Failed to save message", error: error.message });
  }
});

module.exports = router;
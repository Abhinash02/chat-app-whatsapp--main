// backend/models/Status.js
const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  text: { type: String },
  mediaUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  // This 'expiresAt' field with a TTL index is the "easy way"
  // MongoDB will automatically delete documents 24 hours after their 'createdAt' time.
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    index: { expires: "1s" }, // TTL index
  },
});

module.exports = mongoose.model("Status", statusSchema);
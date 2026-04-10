// backend/models/CallLog.js
const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
  caller: { type: String, required: true, index: true },
  receiver: { type: String, required: true, index: true },
  type: { type: String, enum: ["voice", "video"], required: true },
  // dialed, received, missed
  status: { type: String, required: true, index: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CallLog", callLogSchema);

// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   sender: { type: String, required: true },
//   receiver: { type: String, required: true },
//   text: { type: String },
//   mediaUrl: { type: String },
//   type: {
//     type: String,
//     // This enum MUST include all types you send from the frontend
//     enum: ["text", "image", "video", "voice", "doc"], 
//     default: "text",
//     required: true
//   },
//   edited: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   reactions: { type: Map, of: Number, default: {} }
// });

// module.exports = mongoose.model("Message", messageSchema);


// backend/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String },
  mediaUrl: { type: String },
  
  type: {
    type: String,
    // This enum MUST include all types you send from the frontend
    enum: ["text", "image", "video", "voice", "doc"], 
    default: "text",
    required: true
  },
  edited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  reactions: { type: Map, of: Number, default: {} }
});

module.exports = mongoose.model("Message", messageSchema);
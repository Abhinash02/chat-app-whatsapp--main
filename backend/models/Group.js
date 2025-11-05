
// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   members: [{ type: String }],
//   admins: [{ type: String }],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Group", groupSchema);

const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: String, required: true }],
  admins: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
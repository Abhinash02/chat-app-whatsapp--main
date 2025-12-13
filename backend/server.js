// 🚀 IMPORTS
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

// Try to load .env 
const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.local' });
}
console.log("DEBUG: JWT_SECRET is:", process.env.JWT_SECRET ? "LOADED ✅" : "MISSING ❌");
const callLogRoutes = require("./routes/callLog");

// 📦 DATABASE & MODELS
const connectDB = require("./config/db");
const Message = require("./models/Message"); // Needed for socket reaction logic

// 🚚 ROUTE IMPORTS
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const messageActionRoutes = require("./routes/messageActions"); // For Edit/Delete
const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status"); 


// ⚙️ INITIALIZATION & CONFIG
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// 📡 SOCKET.IO SERVER
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// 🌎 EXPRESS MIDDLEWARE
app.use(cors());

app.use(express.json());

// Make the 'uploads' directory public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to attach 'io' to every request (req.io)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API ROUTES
app.use("/api/auth", authRoutes.router); // Use the exported 'router'
app.use("/api", messageRoutes); // Handles GET /message, POST /message
app.use("/api", messageActionRoutes); // Handles PUT /message/:id, DELETE /message/:id
app.use("/api/upload", uploadRoutes); // Handles POST /api/upload
app.use("/api/status", statusRoutes); // Handles POST /api/status, GET /api/status/all
// Call Log Routes
app.use("/api", callLogRoutes);

// SOCKET.IO LOGIC
const userSockets = {};

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided."));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; 
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token."));
  }
});

// Main connection handler
io.on("connection", (socket) => {
  const username = socket.user.username;
  console.log(`✅ User connected: ${username} (Socket ID: ${socket.id})`);

  // Add user to our map
  userSockets[username] = socket.id;

  //  Chat Listeners 

  socket.on("privateMessage", (msg) => {
    // msg contains 
    const receiverSocketId = userSockets[msg.receiver];
    const senderSocketId = userSockets[msg.sender]; // Get the sender's ID

    // Emit to receiver
    if (receiverSocketId) {
      console.log(`Emitting to receiver: ${msg.receiver}`);
      io.to(receiverSocketId).emit("privateMessage", msg);
    }

    // Emit the message back to the sender
    if (senderSocketId) {
      console.log(`Emitting back to sender: ${msg.sender}`);
      io.to(senderSocketId).emit("privateMessage", msg);
    }
  });
  // END OF UPDATED BLOCK 

  socket.on("reactToMessage", async ({ messageId, emoji }) => {
    console.log(`Reaction: ${emoji} for message ${messageId} from ${username}`);
    try {
      
      const message = await Message.findById(messageId);
      if (message) {
        const currentCount = message.reactions.get(emoji) || 0;
        message.reactions.set(emoji, currentCount + 1);
        await message.save();

        // 3. Broadcast the reaction to both sender and receiver
        const senderSocketId = userSockets[message.sender];
        const receiverSocketId = userSockets[message.receiver];

        const payload = { messageId, emoji };

        if (senderSocketId)
          io.to(senderSocketId).emit("messageReaction", payload);
        if (receiverSocketId)
          io.to(receiverSocketId).emit("messageReaction", payload);
      }
    } catch (err) {
      console.error("Failed to save reaction:", err);
    }
  });

  //  Call Listeners
  socket.on("callRequest", ({ to, type, offer }) => {
    console.log(`📞 Call Request from ${username} to ${to} (${type})`);
    const receiverSocketId = userSockets[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        from: username,
        type,
        offer,
      });
    }
  });

  socket.on("acceptCall", ({ to, answer }) => {
    console.log(`✔️ Call Accepted by ${username} to ${to}`);
    const callerSocketId = userSockets[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { from: username, answer });
    }
  });

  socket.on("rejectCall", ({ to }) => {
    console.log(`❌ Call Rejected by ${username} to ${to}`);
    const callerSocketId = userSockets[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", { from: username });
    }
  });

  socket.on("endCall", ({ to }) => {
    console.log(`✋ Call Ended by ${username} with ${to}`);
    const otherUserSocketId = userSockets[to];
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit("callEnded", { from: username });
    }
  });
  // ICE CANDIDATES
  socket.on("ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = userSockets[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", {
        from: username,
        candidate,
      });
    }
  });
  // Disconnect Handler

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${username}`);
    // Clean up the user from our map
    if (userSockets[username] === socket.id) {
      delete userSockets[username];
    }
  });
});
// 🏁 START SERVER
app.get("/", (req, res) => {
  res.send("Server is running.");
});

server.listen(PORT, () => {
  console.log(`🚀 Server is live on http://localhost:${PORT}`);
});
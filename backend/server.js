// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const authRoutes = require("./routes/auth");
// const initializeSocket = require("./socket");

// // Import schemas
// require("./models/Message");
// require("./models/Group");
// require("./models/User");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect("mongodb://localhost:27017/chatapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Authentication routes
// app.use("/api/auth", authRoutes);

// // Basic route
// app.get("/", (req, res) => {
//   res.send("Chat app backend running");
// });

// // Socket.IO authentication middleware
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error"));
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

// // Initialize Socket.IO
// initializeSocket(io);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });


// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const path = require("path");

// const messageRoutes = require("./routes/messages");
// const actionRoutes = require("./routes/messageActions");




// // Import routes
// const authRoutes = require("./routes/auth");
// const uploadRoutes = require("./routes/upload");
// const initializeSocket = require("./socket");

// // Import schemas to ensure they are registered
// require("./models/Message");
// require("./models/Group");
// require("./models/User");


// const app = express();
// const server = http.createServer(app);
// const messageActions = require("./routes/messageActions");

// const io = socketIo(server, {

//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT"],
//   },
// });

// app.use(cors());
// app.use(express.json());
// app.use("/api", messageActions);
// app.use("/api", messageRoutes);
// app.use("/api", actionRoutes);
// app.use("/api/auth", authRoutes);


// app.use("/api", (req, res, next) => {
//   req.io = io;
//   next();
// });


// // Serve static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB connection
// mongoose
//   .connect("mongodb://localhost:27017/chatapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);

// app.get("/", (req, res) => {
//   res.send("Chat app backend running");
// });

// // Socket.IO authentication middleware
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error"));
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

// // Initialize Socket.IO logic
// initializeSocket(io);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });

// backend/server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const path = require("path");

// // ==== ONLY IMPORT ONCE ====
// const authRoutes       = require("./routes/auth");
// const uploadRoutes     = require("./routes/upload");
// const messageRoutes    = require("./routes/messages");
// const messageActions   = require("./routes/messageActions");
// const initializeSocket = require("./socket");

// // Register Models
// require("./models/User");
// require("./models/Message");
// require("./models/Group");

// // ==== SETUP ====
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "PUT", "DELETE"] }
// });

// // ==== MIDDLEWARE (ORDER MATTERS) ====
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // Give every route access to socket
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ==== ROUTES — ONLY ONE TIME EACH! ====
// app.use("/api/auth",   authRoutes);      // ← ONLY HERE
// app.use("/api/upload", uploadRoutes);    // ← ONLY HERE
// app.use("/api",        messageRoutes);   // ← ONLY HERE
// app.use("/api",        messageActions);  // ← ONLY HERE

// // Home
// app.get("/", (req, res) => res.send("WhatsApp Clone LIVE"));

// // ==== SOCKET AUTH ====
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error("No token"));
//   try {
//     const jwt = require("jsonwebtoken");
//     socket.user = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
//     next();
//   } catch {
//     next(new Error("Invalid token"));
//   }
// });

// // ==== SOCKET LOGIC ====
// initializeSocket(io);

// // ==== DATABASE ====
// mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log("DB Error:", err));

// // ==== START ====
// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`SERVER RUNNING → http://localhost:${PORT}`);
// });



// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const authRoutes = require("./routes/auth");
// const initializeSocket = require("./socket");

// // Import schemas
// require("./models/Message");
// require("./models/Group");
// require("./models/User");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect("mongodb://localhost:27017/chatapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Authentication routes
// app.use("/api/auth", authRoutes);

// // Basic route
// app.get("/", (req, res) => {
//   res.send("Chat app backend running");
// });

// // Socket.IO authentication middleware
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error"));
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

// // Initialize Socket.IO
// initializeSocket(io);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });

// backend/server.js
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketio = require("socket.io");
// const cors = require("cors");
// const path = require("path");



// // ROUTES
// const authRoutes       = require("./routes/auth").router;
// const uploadRoutes     = require("./routes/upload");
// const messagesRoutes   = require("./routes/messages");
// const actionsRoutes    = require("./routes/messageActions");
// const initializeSocket = require("./socket");

// // MODELS
// require("./models/User");
// require("./models/Message");
// require("./models/Group");

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server, {
//   cors: { origin: "http://localhost:3000", methods: ["*"] }
// });

// // MIDDLEWARE
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));
// app.use("/api", require("./routes/messages")); // Ensure messages route is used

// // GIVE SOCKET TO ALL ROUTES 
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api", messagesRoutes);
// app.use("/api", actionsRoutes);

// app.get("/", (req, res) => {
//   res.send("<h1>WhatsApp Clone LIVE</h1><p>Open <a href='http://localhost:3000'>http://localhost:3000</a></p>");
// });

// // SOCKET AUTH + LOGIC
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("No token"));
//   try {
//     const jwt = require("jsonwebtoken");
//     socket.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
//     next();
//   } catch {
//     next(new Error("Invalid token"));
//   }
// });

// initializeSocket(io);

// // DATABASE
// mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
//   .then(() => console.log("MongoDB CONNECTED"))
//   .catch(err => console.log("DB ERROR:", err));

// // START
// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`SERVER RUNNING → http://localhost:${PORT}`);
// });






//server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const http = require("http");
// const { Server } = require("socket.io");
// const multer = require("multer");
// const path = require("path");
// require("dotenv").config();

// // INIT APP
// const app = express();
// const PORT = 5000;

// // MIDDLEWARE
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // MULTER
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// // UPDATE PROFILE
// app.put("/api/auth/profile", authenticate, async (req, res) => {
//   const { username, profileImage } = req.body;
//   const update = {};
//   if (username) update.username = username;
//   if (profileImage) update.profileImage = profileImage;

//   const user = await User.findOneAndUpdate(
//     { username: req.user.username },
//     update,
//     { new: true }
//   );

//   const token = jwt.sign({ username: username || req.user.username }, "secret");
//   res.json({
//     token,
//     username: user.username,
//     profileImage: user.profileImage
//   });
// });




// // MONGOOSE
// mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
//   .then(() => console.log("MongoDB CONNECTED"))
//   .catch(err => console.log(err));

// // MODELS
// const User = mongoose.model("User", new mongoose.Schema({
//   username: { type: String, unique: true },
//   phoneNumber: { type: String, unique: true },
//   password: String,
//   profileImage: { type: String, default: "/default.png" }
// }));

// const Message = mongoose.model("Message", new mongoose.Schema({
//   sender: String,
//   receiver: String,
//   text: String,
//   mediaUrl: String,
//   type: { type: String, enum: ["text", "image", "video"], default: "text" },
//   edited: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// }));

// // AUTH MIDDLEWARE
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });
//   try {
//     req.user = jwt.verify(token, "secret");
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // ROUTES
// app.post("/api/auth/signup", async (req, res) => {
//   const { username, phoneNumber, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ username, phoneNumber, password: hashed });
//   await user.save();
//   const token = jwt.sign({ username }, "secret");
//   res.json({ token, username });
// });

// app.post("/api/auth/login", async (req, res) => {
//   const { phoneNumber, password } = req.body;
//   const user = await User.findOne({ phoneNumber });
//   if (!user || !await bcrypt.compare(password, user.password)) {
//     return res.status(400).json({ message: "Wrong credentials" });
//   }
//   const token = jwt.sign({ username: user.username }, "secret");
//   res.json({ token, username: user.username, profileImage: user.profileImage });
// });

// app.get("/api/auth/me", authenticate, async (req, res) => {
//   const user = await User.findOne({ username: req.user.username });
//   res.json(user);
// });

// app.get("/api/auth/users", authenticate, async (req, res) => {
//   const users = await User.find().select("username profileImage");
//   res.json(users);
// });

// app.get("/api/message", authenticate, async (req, res) => {
//   const { receiver } = req.query;
//   const messages = await Message.find({
//     $or: [
//       { app.post("/api/message", authenticate, async (req, res) => {
//   try {
//     const { receiver, text, mediaUrl, type = "text" } = req.body;
//     const sender = req.user?.username || "unknown"; // ← FIX CRASH

//     const message = new Message({
//       sender,
//       receiver,
//       text,
//       mediaUrl,
//       type
//     });
//     await message.save();

//     // SEND REAL-TIME
//     io.emit("privateMessage", { ...message._doc, sender: sender === req.user.username ? "You" : sender });

//     res.json(message);
//   } catch (err) {
//     console.log("SEND ERROR:", err);
//     res.status(500).json({ message: "Send failed" });
//   }
// }); receiver },
//       { sender: receiver, receiver: req.user.username }
//     ]
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// app.post("/api/message", authenticate, async (req, res) => {
//   const { receiver, text, mediaUrl, type = "text" } = req.body;
//   const message = new Message({
//     sender: req.user.username,
//     receiver,
//     text,
//     mediaUrl,
//     type
//   });
//   await message.save();
//   res.json(message);
// });

// app.put("/api/message/:id", authenticate, async (req, res) => {
//   const { text } = req.body;
//   const message = await Message.findByIdAndUpdate(
//     req.params.id,
//     { text, edited: true },
//     { new: true }
//   );
//   res.json(message);
// });

// app.delete("/api/message/:id", authenticate, async (req, res) => {
//   await Message.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// app.post("/api/upload", authenticate, upload.single("file"), (req, res) => {
//   res.json({ filePath: `/uploads/${req.file.filename}` });
// });

// // SOCKET.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:3000" }
// });

// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return socket.disconnect();

//   let username;
//   try {
//     username = jwt.verify(token, "secret").username;
//     onlineUsers.set(username, socket.id);
//   } catch {
//     return socket.disconnect();
//   }

//   // SEND USER LIST
//   const userList = Array.from(onlineUsers.keys()).map(u => ({ username: u }));
//   io.emit("userList", userList);

//   socket.on("privateMessage", (msg) => {
//     const fullMsg = { ...msg, sender: username };
//     const receiverSocket = onlineUsers.get(msg.receiver);
//     if (receiverSocket) {
//       io.to(receiverSocket).emit("privateMessage", fullMsg);
//     }
//     socket.emit("privateMessage", { ...fullMsg, sender: "You" });
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.delete(username);
//     io.emit("userList", Array.from(onlineUsers.keys()).map(u => ({ username: u })));
//   });
// });

// // START SERVER
// server.listen(PORT, () => {
//   console.log(`SERVER RUNNING → http://localhost:${PORT}`);
// });



// backend/server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const http = require("http");
// const { Server } = require("socket.io");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const PORT = 5000;

// // MIDDLEWARE
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // MULTER
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });

// // MONGOOSE
// mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
//   .then(() => console.log("MongoDB CONNECTED"))
//   .catch(err => console.log(err));

// // MODELS
// const User = mongoose.model("User", new mongoose.Schema({
//   username: { type: String, unique: true },
//   phoneNumber: { type: String, unique: true },
//   password: String,
//   profileImage: { type: String, default: "/default.png" }
// }));

// const Message = mongoose.model("Message", new mongoose.Schema({
//   sender: String,
//   receiver: String,
//   text: String,
//   mediaUrl: String,
//   type: { type: String, enum: ["text", "image", "doc"], default: "text" },
//   edited: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// }));

// // AUTH MIDDLEWARE
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });
//   try {
//     const decoded = jwt.verify(token, "secret");
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // ROUTES
// app.post("/api/auth/signup", async (req, res) => {
//   const { username, phoneNumber, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ username, phoneNumber, password: hashed });
//   await user.save();
//   const token = jwt.sign({ username }, "secret");
//   res.json({ token, username });
// });

// app.post("/api/auth/login", async (req, res) => {
//   const { phoneNumber, password } = req.body;
//   const user = await User.findOne({ phoneNumber });
//   if (!user || !await bcrypt.compare(password, user.password))
//     return res.status(400).json({ message: "Wrong credentials" });
//   const token = jwt.sign({ username: user.username }, "secret");
//   res.json({ token, username: user.username, profileImage: user.profileImage });
// });

// app.get("/api/auth/me", authenticate, async (req, res) => {
//   const user = await User.findOne({ username: req.user.username });
//   res.json(user);
// });

// app.get("/api/auth/users", authenticate, async (req, res) => {
//   const users = await User.find().select("username profileImage");
//   res.json(users);
// });

// app.put("/api/auth/profile", authenticate, async (req, res) => {
//   const { username, profileImage } = req.body;
//   const update = {};
//   if (username) update.username = username;
//   if (profileImage) update.profileImage = profileImage;
//   const user = await User.findOneAndUpdate(
//     { username: req.user.username },
//     update,
//     { new: true }
//   );
//   const token = jwt.sign({ username: username || req.user.username }, "secret");
//   res.json({ token, username: user.username, profileImage: user.profileImage });
// });

// //Status post route
// app.post("/api/status", authenticate, async (req, res) => {
//   res.json({ success: true, message: "Status posted!" });
// });

// // MESSAGES
// app.get("/api/message", authenticate, async (req, res) => {
//   const { receiver } = req.query;
//   const messages = await Message.find({
//     $or: [
//       { sender: req.user.username, receiver },
//       { sender: receiver, receiver: req.user.username }
//     ]
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// app.post("/api/message", authenticate, async (req, res) => {
//   try {
//     const { receiver, text, mediaUrl, type = "text" } = req.body;
//     const message = new Message({
//       sender: req.user.username,
//       receiver,
//       text,
//       mediaUrl,
//       type
//     });
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     console.log("SEND ERROR:", err);
//     res.status(500).json({ message: "Send failed" });
//   }
// });

// app.put("/api/message/:id", authenticate, async (req, res) => {
//   const message = await Message.findByIdAndUpdate(
//     req.params.id,
//     { text: req.body.text, edited: true },
//     { new: true }
//   );
//   res.json(message);
// });

// app.delete("/api/message/:id", authenticate, async (req, res) => {
//   await Message.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// app.post("/api/upload", authenticate, upload.single("file"), (req, res) => {
//   res.json({ filePath: `/uploads/${req.file.filename}` });
// });

// // SOCKET.IO
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return socket.disconnect();
//   let username;
//   try {
//     username = jwt.verify(token, "secret").username;
//     onlineUsers.set(username, socket.id);
//   } catch { return socket.disconnect(); }

//   io.emit("userList", Array.from(onlineUsers.keys()).map(u => ({ username: u })));

//   socket.on("privateMessage", (msg) => {
//     const fullMsg = { ...msg, sender: username };
//     const receiverSocket = onlineUsers.get(msg.receiver);
//     if (receiverSocket) io.to(receiverSocket).emit("privateMessage", fullMsg);
//     socket.emit("privateMessage", { ...fullMsg, sender: "You" });
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.delete(username);
//     io.emit("userList", Array.from(onlineUsers.keys()).map(u => ({ username: u })));
//   });
// });

// server.listen(PORT, () => console.log(`SERVER RUNNING → http://localhost:${PORT}`));

// backend/server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const http = require("http");
// const { Server } = require("socket.io");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const PORT = 5000;


// // ==================== MIDDLEWARE ====================
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // MULTER (for photos, voice, docs)
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// // ==================== MONGOOSE ====================
// mongoose
//   .connect("mongodb://127.0.0.1:27017/whatsapp")
//   .then(() => console.log("MongoDB CONNECTED"))
//   .catch((err) => console.log(err));

// // ==================== MODELS ====================
// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({
//     username: { type: String, unique: true },
//     phoneNumber: { type: String, unique: true },
//     password: String,
//     profileImage: { type: String, default: "/default.png" },
//   })
// );

// const Message = mongoose.model(
//   "Message",
//   new mongoose.Schema({
//     sender: String,
//     receiver: String,
//     text: String,
//     mediaUrl: String,
//     type: { type: String, enum: ["text", "image", "voice", "doc"], default: "text" },
//     edited: { type: Boolean, default: false },
//     reactions: { type: Map, of: Number, default: {} },
//     createdAt: { type: Date, default: Date.now },
//   })
// );

// const Status = mongoose.model(
//   "Status",
//   new mongoose.Schema({
//     username: String,
//     text: String,
//     mediaUrl: String,
//     createdAt: { type: Date, default: Date.now },
//   })
// );

// // ==================== AUTH MIDDLEWARE ====================
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   jwt.verify(token, "secret", (err, decoded) => {
//     if (err) return res.status(401).json({ message: "Invalid token" });
//     req.user = decoded; // ← THIS FIXES 500
//     next();
//   });
// };


// // ==================== ROUTES ====================
// // SIGNUP
// app.post("/api/auth/signup", async (req, res) => {
//   const { username, phoneNumber, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ username, phoneNumber, password: hashed });
//   await user.save();
//   const token = jwt.sign({ username }, "secret");
//   res.json({ token, username });
// });

// // LOGIN
// app.post("/api/auth/login", async (req, res) => {
//   const { phoneNumber, password } = req.body;
//   const user = await User.findOne({ phoneNumber });
//   if (!user || !(await bcrypt.compare(password, user.password)))
//     return res.status(400).json({ message: "Wrong credentials" });
//   const token = jwt.sign({ username: user.username }, "secret");
//   res.json({ token, username: user.username, profileImage: user.profileImage });
// });

// // ME
// app.get("/api/auth/me", authenticate, async (req, res) => {
//   const user = await User.findOne({ username: req.user.username });
//   res.json(user);
// });

// // USERS LIST
// app.get("/api/auth/users", authenticate, async (req, res) => {
//   const users = await User.find().select("username profileImage");
//   res.json(users);
// });

// // UPDATE PROFILE
// app.put("/api/auth/profile", authenticate, async (req, res) => {
//   const { username, profileImage } = req.body;
//   const update = {};
//   if (username) update.username = username;
//   if (profileImage) update.profileImage = profileImage;

//   const user = await User.findOneAndUpdate(
//     { username: req.user.username },
//     update,
//     { new: true }
//   );
//   const token = jwt.sign({ username: username || req.user.username }, "secret");
//   res.json({ token, username: user.username, profileImage: user.profileImage });
// });

// // GET MESSAGES
// app.get("/api/message", authenticate, async (req, res) => {
//   const { receiver } = req.query;
//   const messages = await Message.find({
//     $or: [
//       { sender: req.user.username, receiver },
//       { sender: receiver, receiver: req.user.username },
//     ],
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// // SEND MESSAGE (TEXT / IMAGE / VOICE / DOC)
// app.post("/api/message", authenticate, async (req, res) => {
//   try {
//     const { receiver, text, mediaUrl, type = "text" } = req.body;
//     const message = new Message({
//       sender: req.user.username,
//       receiver,
//       text,
//       mediaUrl,
//       type,
//     });
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     console.log("SEND ERROR:", err.message);
//     res.status(500).json({ error: "Send failed" });
//   }
// });


// // EDIT MESSAGE
// app.put("/api/message/:id", authenticate, async (req, res) => {
//   const message = await Message.findByIdAndUpdate(
//     req.params.id,
//     { text: req.body.text, edited: true },
//     { new: true }
//   );
//   res.json(message);
// });

// // DELETE MESSAGE
// app.delete("/api/message/:id", authenticate, async (req, res) => {
//   await Message.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// // UPLOAD FILE
// app.post("/api/upload", authenticate, upload.single("file"), (req, res) => {
//   res.json({ filePath: `/uploads/${req.file.filename}` });
// });

// // POST STATUS
// app.post("/api/status", authenticate, async (req, res) => {
//   const { text, mediaUrl } = req.body;
//   const status = new Status({
//     username: req.user.username,
//     text,
//     mediaUrl,
//   });
//   await status.save();
//   res.json({ success: true });
// });

// // ==================== SOCKET.IO ====================
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:3000" },
// });

// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return socket.disconnect();

//   let username;
//   try {
//     username = jwt.verify(token, "secret").username;
//     onlineUsers.set(username, socket.id);
//   } catch {
//     return socket.disconnect();
//   }

//   // BROADCAST USER LIST
//   io.emit("userList", Array.from(onlineUsers.keys()).map((u) => ({ username: u })));

//   // PRIVATE MESSAGE
//   socket.on("privateMessage", (msg) => {
//     const fullMsg = { ...msg, sender: username };
//     const receiverSocket = onlineUsers.get(msg.receiver);
//     if (receiverSocket) io.to(receiverSocket).emit("privateMessage", fullMsg);
//     socket.emit("privateMessage", { ...fullMsg, sender: "You" });
//   });

//   // REACTION
//   socket.on("reactToMessage", ({ messageId, emoji }) => {
//     Message.findByIdAndUpdate(
//       messageId,
//       { $inc: { [`reactions.${emoji}`]: 1 } },
//       { new: true }
//     ).then((updated) => {
//       io.emit("messageReaction", { messageId, emoji, count: updated.reactions.get(emoji) });
//     });
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.delete(username);
//     io.emit("userList", Array.from(onlineUsers.keys()).map((u) => ({ username: u })));
//   });
// });

// // ==================== START SERVER ====================
// server.listen(PORT, () => {
//   console.log(`SERVER RUNNING → http://localhost:${PORT}`);
// });



// =================================================================
// 🚀 IMPORTS
// =================================================================
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const path = require("path");
// const jwt = require("jsonwebtoken");
// require("dotenv").config(); 
// const callLogRoutes = require("./routes/callLog"); 

// // =================================================================
// // 📦 DATABASE & MODELS
// // =================================================================
// const connectDB = require("./config/db");
// const Message = require("./models/Message"); // Needed for socket reaction logic

// // =================================================================
// // 🚚 ROUTE IMPORTS
// // =================================================================
// // Note: auth.js exports an object { router, authenticate }
// const authRoutes = require("./routes/auth");
// const messageRoutes = require("./routes/messages");
// const messageActionRoutes = require("./routes/messageActions"); // For Edit/Delete
// const uploadRoutes = require("./routes/upload");
// const statusRoutes = require("./routes/status"); // <-- NEW Status Routes

// // =================================================================
// // ⚙️ INITIALIZATION & CONFIG
// // =================================================================
// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // =================================================================
// // 📡 SOCKET.IO SERVER
// // =================================================================
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for development
//     methods: ["GET", "POST"],
//   },
// });

// // =================================================================
// // 🌎 EXPRESS MIDDLEWARE
// // =================================================================
// // Enable CORS for all REST API requests
// app.use(cors());

// // Allow express to parse JSON bodies
// app.use(express.json());

// // Make the 'uploads' directory public
// // This is crucial for serving images, voice notes, and status media
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// // Middleware to attach 'io' to every request (req.io)
// // This is needed for your Messageaction.js to emit events after DB changes
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // =================================================================
// // 🚦 API ROUTES
// // =================================================================
// app.use("/api/auth", authRoutes.router); // Use the exported 'router'
// app.use("/api", messageRoutes); // Handles GET /message, POST /message
// app.use("/api", messageActionRoutes); // Handles PUT /message/:id, DELETE /message/:id
// app.use("/api/upload", uploadRoutes); // Handles POST /api/upload
// app.use("/api/status", statusRoutes); // Handles POST /api/status, GET /api/status/all
// // Call Log Routes
// app.use("/api", callLogRoutes); 

// // =================================================================
// // SOCKET.IO LOGIC
// // =================================================================

// // Maps: { username -> socket.id }
// // This is vital for sending calls/messages to a specific user
// const userSockets = {};

// // Socket.IO Authentication Middleware
// // This runs for *every* new socket connection
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("Authentication error: No token provided."));
//   }
//   try {
//     // Verify the token and attach the user payload to the socket
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded; // Contains { userId, username }
//     next();
//   } catch (err) {
//     return next(new Error("Authentication error: Invalid token."));
//   }
// });

// // Main connection handler
// io.on("connection", (socket) => {
//   const username = socket.user.username;
//   console.log(`✅ User connected: ${username} (Socket ID: ${socket.id})`);

//   // Add user to our map
//   userSockets[username] = socket.id;

//   // --- 💬 Chat Listeners ---

//   socket.on("privateMessage", (msg) => {
//     // 'msg' contains { receiver, text, type, mediaUrl, ... }
//     const receiverSocketId = userSockets[msg.receiver];
//     const senderSocketId = userSockets[msg.sender]; // <-- 1. Get the sender's ID
//     if (receiverSocketId) {
//       // Send the message only to that specific user
//       io.to(receiverSocketId).emit("privateMessage", msg);
//     }
//   });

//   socket.on("reactToMessage", async ({ messageId, emoji }) => {
//     console.log(`Reaction: ${emoji} for message ${messageId} from ${username}`);
//     try {
//       // 1. Find the message in the database
//       const message = await Message.findById(messageId);
//       if (message) {
//         // 2. Update the reactions map
//         // (This logic is basic, a real app might toggle user's reaction)
//         const currentCount = message.reactions.get(emoji) || 0;
//         message.reactions.set(emoji, currentCount + 1);
//         await message.save();

//         // 3. Broadcast the reaction to both sender and receiver
//         const senderSocketId = userSockets[message.sender];
//         const receiverSocketId = userSockets[message.receiver];

//         const payload = { messageId, emoji };

//         if (senderSocketId) io.to(senderSocketId).emit("messageReaction", payload);
//         if (receiverSocketId) io.to(receiverSocketId).emit("messageReaction", payload);
//       }
//     } catch (err) {
//       console.error("Failed to save reaction:", err);
//     }
//   });

//   // --- 📞 Call Listeners ---

//   socket.on("callRequest", ({ to, type, offer }) => {
//     console.log(`📞 Call Request from ${username} to ${to} (${type})`);
//     const receiverSocketId = userSockets[to];
//     if (receiverSocketId) {
//       // Send the call offer to the specific receiver
//       io.to(receiverSocketId).emit("incomingCall", { from: username, type, offer });
//     }
//   });

//   socket.on("acceptCall", ({ to, answer }) => {
//     console.log(`✔️ Call Accepted by ${username} to ${to}`);
//     const callerSocketId = userSockets[to];
//     if (callerSocketId) {
//       io.to(callerSocketId).emit("callAccepted", { from: username, answer });
//     }
//   });

//   socket.on("rejectCall", ({ to }) => {
//     console.log(`❌ Call Rejected by ${username} to ${to}`);
//     const callerSocketId = userSockets[to];
//     if (callerSocketId) {
//       io.to(callerSocketId).emit("callRejected", { from: username });
//     }
//   });

//   socket.on("endCall", ({ to }) => {
//     console.log(`✋ Call Ended by ${username} with ${to}`);
//     const otherUserSocketId = userSockets[to];
//     if (otherUserSocketId) {
//       io.to(otherUserSocketId).emit("callEnded", { from: username });
//     }
//   });
//   // ICE CANDIDATES
//   socket.on("ice-candidate", ({ to, candidate }) => {
//     const receiverSocketId = userSockets[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("ice-candidate", { from: username, candidate });
//     }
//   });
//   // --- 🔌 Disconnect Handler ---

//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${username}`);
//     // Clean up the user from our map
//     if (userSockets[username] === socket.id) {
//       delete userSockets[username];
//     }
//   });
// });

// // =================================================================
// // 🏁 START SERVER
// // =================================================================
// app.get("/", (req, res) => {
//   res.send("Server is running.");
// });

// server.listen(PORT, () => {
//   console.log(`🚀 Server is live on http://localhost:${PORT}`);
// });




// =================================================================
// 🚀 IMPORTS
// =================================================================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const callLogRoutes = require("./routes/callLog");

// =================================================================
// 📦 DATABASE & MODELS
// =================================================================
const connectDB = require("./config/db");
const Message = require("./models/Message"); // Needed for socket reaction logic

// =================================================================
// 🚚 ROUTE IMPORTS
// =================================================================
// Note: auth.js exports an object { router, authenticate }
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const messageActionRoutes = require("./routes/messageActions"); // For Edit/Delete
const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status"); // <-- NEW Status Routes

// =================================================================
// ⚙️ INITIALIZATION & CONFIG
// =================================================================
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// =================================================================
// 📡 SOCKET.IO SERVER
// =================================================================
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
  },
});

// =================================================================
// 🌎 EXPRESS MIDDLEWARE
// =================================================================
// Enable CORS for all REST API requests
app.use(cors());

// Allow express to parse JSON bodies
app.use(express.json());

// Make the 'uploads' directory public
// This is crucial for serving images, voice notes, and status media
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to attach 'io' to every request (req.io)
// This is needed for your Messageaction.js to emit events after DB changes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =================================================================
// 🚦 API ROUTES
// =================================================================
app.use("/api/auth", authRoutes.router); // Use the exported 'router'
app.use("/api", messageRoutes); // Handles GET /message, POST /message
app.use("/api", messageActionRoutes); // Handles PUT /message/:id, DELETE /message/:id
app.use("/api/upload", uploadRoutes); // Handles POST /api/upload
app.use("/api/status", statusRoutes); // Handles POST /api/status, GET /api/status/all
// Call Log Routes
app.use("/api", callLogRoutes);

// =================================================================
// SOCKET.IO LOGIC
// =================================================================

// Maps: { username -> socket.id }
// This is vital for sending calls/messages to a specific user
const userSockets = {};

// Socket.IO Authentication Middleware
// This runs for *every* new socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided."));
  }
  try {
    // Verify the token and attach the user payload to the socket
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Contains { userId, username }
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

  // --- 💬 Chat Listeners ---

  // --- THIS IS THE UPDATED BLOCK ---
  socket.on("privateMessage", (msg) => {
    // msg contains { sender, receiver, text, ... }
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
  // --- END OF UPDATED BLOCK ---

  socket.on("reactToMessage", async ({ messageId, emoji }) => {
    console.log(`Reaction: ${emoji} for message ${messageId} from ${username}`);
    try {
      // 1. Find the message in the database
      const message = await Message.findById(messageId);
      if (message) {
        // 2. Update the reactions map
        // (This logic is basic, a real app might toggle user's reaction)
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

  // --- 📞 Call Listeners ---

  socket.on("callRequest", ({ to, type, offer }) => {
    console.log(`📞 Call Request from ${username} to ${to} (${type})`);
    const receiverSocketId = userSockets[to];
    if (receiverSocketId) {
      // Send the call offer to the specific receiver
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
  // --- 🔌 Disconnect Handler ---

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${username}`);
    // Clean up the user from our map
    if (userSockets[username] === socket.id) {
      delete userSockets[username];
    }
  });
});

// =================================================================
// 🏁 START SERVER
// =================================================================
app.get("/", (req, res) => {
  res.send("Server is running.");
});

server.listen(PORT, () => {
  console.log(`🚀 Server is live on http://localhost:${PORT}`);
});
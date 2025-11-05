
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// // MIDDLEWARE
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// // SIGNUP
// router.post("/signup", async (req, res) => {
//   const { username, phoneNumber, password } = req.body;
//   if (!username || !phoneNumber || !password) {
//     return res.status(400).json({ message: "Fill all fields" });
//   }

//   try {
//     if (await User.findOne({ $or: [{ username }, { phoneNumber }] })) {
//       return res.status(400).json({ message: "Already taken" });
//     }

//     const user = new User({ username, phoneNumber, password });
//     user.password = await bcrypt.hash(password, 10);
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       phoneNumber,
//       profileImage: user.profileImage,
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // GET ALL USERS
// router.get("/users", authenticate, async (req, res) => {
//   const users = await User.find().select("username profileImage");
//   res.json(users);
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { phoneNumber, password } = req.body;

//   // --- THIS IS THE ADDED VALIDATION ---
//   if (!phoneNumber || !password) {
//     return res.status(400).json({ message: "Please enter phone and password" });
//   }
//   // --- END OF ADDED VALIDATION ---

//   try {
//     const user = await User.findOne({ phoneNumber });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ message: "Wrong credentials" });
//     }

//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       phoneNumber,
//       profileImage: user.profileImage,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET ME
// router.get("/me", authenticate, async (req, res) => {
//   const user = await User.findById(req.user.userId).select("-password");
//   res.json(user);
// });

// // UPDATE PROFILE
// router.put("/profile", authenticate, async (req, res) => {
//   const { username, phoneNumber, profileImage } = req.body;
//   const user = await User.findById(req.user.userId);

//   if (
//     username &&
//     username !== user.username &&
//     (await User.findOne({ username }))
//   ) {
//     return res.status(400).json({ message: "Username taken" });
//   }
//   if (
//     phoneNumber &&
//     phoneNumber !== user.phoneNumber &&
//     (await User.findOne({ phoneNumber }))
//   ) {
//     return res.status(400).json({ message: "Phone taken" });
//   }

//   user.username = username || user.username;
//   user.phoneNumber = phoneNumber || user.phoneNumber;
//   user.profileImage = profileImage || user.profileImage;
//   await user.save();

//   const token = jwt.sign(
//     { userId: user._id, username: user.username },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.json({
//     token,
//     username: user.username,
//     phoneNumber: user.phoneNumber,
//     profileImage: user.profileImage,
//   });
// });

// module.exports = { router, authenticate };




const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// MIDDLEWARE
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, phoneNumber, password } = req.body;
  if (!username || !phoneNumber || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  // --- ADDED VALIDATION from your login page ---
  if (phoneNumber.length !== 10) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  // --- END VALIDATION ---

  try {
    if (await User.findOne({ $or: [{ username }, { phoneNumber }] })) {
      return res.status(400).json({ message: "Already taken" });
    }

    // User model pre-save hook handles hashing
    const user = new User({ username, phoneNumber, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    // Handle validation errors from the model (e.g., phone format)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL USERS
router.get("/users", authenticate, async (req, res) => {
  const users = await User.find().select("username profileImage");
  res.json(users);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: "Please enter phone and password" });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    
    // Use the comparePassword method from your User model
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ME
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

// --- FULLY UPDATED /profile ROUTE ---
router.put("/profile", authenticate, async (req, res) => {
  try {
    // 1. Get all fields from body
    const { username, phoneNumber, profileImage, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check username/phone conflicts
    if (username && username !== user.username && (await User.findOne({ username }))) {
      return res.status(400).json({ message: "Username taken" });
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber && (await User.findOne({ phoneNumber }))) {
      return res.status(400).json({ message: "Phone taken" });
    }

    // 3. Update basic info
    user.username = username || user.username;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImage || user.profileImage;

    // --- 4. NEW PASSWORD UPDATE LOGIC ---
    if (oldPassword && newPassword) {
      if (newPassword.length < 6) {
          return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      // Use the comparePassword method from your User model
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      // The pre-save hook in your User.js model will automatically hash this
      user.password = newPassword;
    }
    // --- END NEW LOGIC ---

    await user.save();

    // 5. Respond with new token and user info
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { router, authenticate };
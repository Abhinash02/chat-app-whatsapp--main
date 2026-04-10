// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// // const twilio = require("twilio"); // 
// const User = require("../models/User");
// const router = express.Router();

// // --- TWILIO CLIENT COMMENTED OUT ---
// /*
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
// */

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

// // --- 1. SIGNUP (Updated to Direct Login) ---
// router.post("/signup", async (req, res) => {
//   const { username, phoneNumber, password } = req.body;

//   // Validation
//   if (!username || !phoneNumber || !password) {
//     return res.status(400).json({ message: "Fill all fields" });
//   }
//   if (phoneNumber.length !== 10) {
//     return res.status(400).json({ message: "Phone number must be 10 digits" });
//   }
//   if (password.length < 6) {
//     return res.status(400).json({ message: "Password must be at least 6 characters" });
//   }

//   try {
//     // Check if user exists
//     let user = await User.findOne({ phoneNumber });

//     if (user) {
//         return res.status(400).json({ message: "Phone number already registered" });
//     } else {
//       // Check if username is taken
//       const existingUsername = await User.findOne({ username });
//       if (existingUsername) {
//         return res.status(400).json({ message: "Username taken" });
//       }
//       // Create new user instance
//       user = new User({ username, phoneNumber, password });
//     }

//     // --- TWILIO LOGIC REMOVED ---
//     // We set isVerified to true immediately since we aren't doing OTP
//     user.isVerified = true;
    
//     /* // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
    
//     await client.messages.create({ ... });
//     */
   
//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();
//     console.log(`🔐 MOCK OTP for ${phoneNumber}: ${otp}`);
//     // Old: res.json({ message: "OTP generated (Check server console)" });
//     // New: Send the OTP back to frontend
//     res.json({ message: "OTP generated", otp: otp });

//     await user.save();

//     // --- GENERATE TOKEN IMMEDIATELY (Direct Login) ---
//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       phoneNumber: user.phoneNumber,
//       profileImage: user.profileImage,
//     });

//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // --- 2. VERIFY OTP (Commented Out - Unused) ---
// /*
// router.post("/verify-otp", async (req, res) => {
//   // ... (Original logic commented out) ...
// });
// */

// // LOGIN 
// router.post("/login", async (req, res) => {
//   const { phoneNumber, password } = req.body;

//   if (!phoneNumber || !password) {
//     return res.status(400).json({ message: "Please enter phone and password" });
//   }

//   try {
//     const user = await User.findOne({ phoneNumber });
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ message: "Wrong credentials" });
//     }

//     // --- TWILIO: Commented out verification check ---
//     /*
//     if (!user.isVerified) {
//        return res.status(400).json({ message: "Account not verified." });
//     }
//     */

//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       phoneNumber: user.phoneNumber,
//       profileImage: user.profileImage,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // FORGOT PASSWORD (Mock Only / Disabled SMS)
// router.post("/forgot-password", async (req, res) => {
//   const { phoneNumber } = req.body;

//   try {
//     const user = await User.findOne({ phoneNumber });
//     if (!user) {
//       return res.status(404).json({ message: "User not found with this number" });
//     }

//     // Generate 6-digit OTP (Still needed if you want to test Reset locally via Console)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();
    
//     // --- TWILIO SMS COMMENTED OUT ---
//     console.log(`🔐 MOCK OTP for ${phoneNumber} (RESET PASSWORD): ${otp}`);
//     /*
//     await client.messages.create({
//       body: `Your WhatsApp Clone Password Reset Code is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: `+91${phoneNumber}`, 
//     });
//     */

//     res.json({ message: "OTP generated (Check server console)" });

//   } catch (err) {
//     console.error("Forgot password error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // RESET PASSWORD (Unchanged logic, just relies on Mock OTP)
// router.post("/reset-password", async (req, res) => {
//   const { phoneNumber, otp, newPassword } = req.body;

//   if (newPassword.length < 6) {
//     return res.status(400).json({ message: "Password must be at least 6 characters" });
//   }

//   try {
//     const user = await User.findOne({ phoneNumber });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify OTP
//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     user.password = newPassword;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful. Please login." });

//   } catch (err) {
//     console.error("Reset password error:", err);
//     res.status(500).json({ message: "Server error resetting password" });
//   }
// });

// // GET ALL USERS (Updated to show all users, ignoring verification status)
// router.get("/users", authenticate, async (req, res) => {
//   // Removed { isVerified: true } filter
//   const users = await User.find().select("username profileImage");
//   res.json(users);
// });

// // GET ME
// router.get("/me", authenticate, async (req, res) => {
//   const user = await User.findById(req.user.userId).select("-password");
//   res.json(user);
// });

// // UPDATE PROFILE
// router.put("/profile", authenticate, async (req, res) => {
//   try {
//     const { username, phoneNumber, profileImage, oldPassword, newPassword } = req.body;
//     const user = await User.findById(req.user.userId);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (username && username !== user.username && (await User.findOne({ username }))) {
//       return res.status(400).json({ message: "Username taken" });
//     }
//     if (phoneNumber && phoneNumber !== user.phoneNumber && (await User.findOne({ phoneNumber }))) {
//       return res.status(400).json({ message: "Phone taken" });
//     }

//     user.username = username || user.username;
//     user.phoneNumber = phoneNumber || user.phoneNumber;
//     user.profileImage = profileImage || user.profileImage;

//     if (oldPassword && newPassword) {
//       if (newPassword.length < 6) return res.status(400).json({ message: "New password too short" });
//       const isMatch = await user.comparePassword(oldPassword);
//       if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });
//       user.password = newPassword;
//     }

//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, username: user.username, phoneNumber: user.phoneNumber, profileImage: user.profileImage });

//   } catch (err) {
//     console.error("Profile update error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // BLOCK USER
// router.post("/block", authenticate, async (req, res) => {
//   const { blockUsername } = req.body;
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user.blockedUsers.includes(blockUsername)) {
//       user.blockedUsers.push(blockUsername);
//       await user.save();
//     }
//     res.json({ message: `Blocked ${blockUsername}`, blockedUsers: user.blockedUsers });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
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

//  SIGNUP 
router.post("/signup", async (req, res) => {
  const { username, phoneNumber, password } = req.body;

  // Validation
  if (!username || !phoneNumber || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }
  if (phoneNumber.length !== 10) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    if (user) {
        return res.status(400).json({ message: "Phone number already registered" });
    } else {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username taken" });
      }
      // Create new user instance
      user = new User({ username, phoneNumber, password });
    }
    user.isVerified = true;
    
    await user.save();

    // GENERATE TOKEN 
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
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  LOGIN 
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: "Please enter phone and password" });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    
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
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  FORGOT PASSWORD (MOCK OTP)
router.post("/forgot-password", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found with this number" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();
    
    console.log(`🔐 MOCK OTP for ${phoneNumber} (RESET PASSWORD): ${otp}`);

    // SEND OTP IN RESPONSE
    res.json({ message: "OTP generated", otp: otp });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// RESET PASSWORD 
router.post("/reset-password", async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

// GET ALL USERS 
router.get("/users", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("username profileImage");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET CURRENT USER 
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE PROFILE 
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, phoneNumber, profileImage, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username && (await User.findOne({ username }))) {
      return res.status(400).json({ message: "Username taken" });
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber && (await User.findOne({ phoneNumber }))) {
      return res.status(400).json({ message: "Phone taken" });
    }

    user.username = username || user.username;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImage || user.profileImage;

    if (oldPassword && newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: "New password too short" });
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });
      user.password = newPassword;
    }

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, username: user.username, phoneNumber: user.phoneNumber, profileImage: user.profileImage });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  BLOCK USER 
router.post("/block", authenticate, async (req, res) => {
  const { blockUsername } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user.blockedUsers.includes(blockUsername)) {
      user.blockedUsers.push(blockUsername);
      await user.save();
    }
    res.json({ message: `Blocked ${blockUsername}`, blockedUsers: user.blockedUsers });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { router, authenticate };